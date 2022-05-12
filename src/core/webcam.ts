import { AvatarLandmarks } from "./avatar";

declare var FaceMesh: any;
declare var Camera: any;
export class Webcam{
  
  landmarks = {};
  lastLandmarks = {};
  camera: any;
  videoElement: HTMLElement;

  init(callback: any){
    this.videoElement = document.createElement("video");
    this.videoElement.style.display = "none";
    this.videoElement.style.width = "250px";
    this.videoElement.style.transform = "scale(-1, 1)";

    const faceMesh = new FaceMesh({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }});

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results: any)=>{
      let landmarks = this.getLandmarksFormatted(results.multiFaceLandmarks);

      let landmarksLength = Object.keys(landmarks).length;
      let lastLandmarksLength = Object.keys(this.lastLandmarks).length;

      if(landmarksLength == 0 && lastLandmarksLength > 0){
        landmarks = this.lastLandmarks;
      }else if(landmarksLength == 0 && lastLandmarksLength == 0){
        return;
      }

      let result = {
        image: results.image,
        landmarks: landmarks
      }

      this.lastLandmarks = landmarks;

      callback(result);
    });

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await faceMesh.send({image: this.videoElement});
      },
      width: 640,
      height: 480
    });
    this.camera.start();
  }

  destroy(){
    if(this.camera) this.camera.stop();
    if(this.videoElement) this.videoElement.remove();
  }

  getLandmarksFormatted(multiFaceLandmarks: any){
    let landmarks = multiFaceLandmarks.length > 0 ? multiFaceLandmarks[0] : [];
    if(landmarks.length == 0 ) return {};
  
    let result = {};
  
    AvatarLandmarks.forEach((n)=>{
      result[n] = landmarks[n];
    });
  
    return result;
  }
}