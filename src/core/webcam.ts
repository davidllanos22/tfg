import { AvatarLandmarks } from "./avatar";

declare var FaceMesh: any;
declare var Camera: any;
export class Webcam{
  
  landmarks = {};
  lastLandmarks = {};

  init(callback: any){
    const videoElement = document.createElement("video");
    videoElement.style.display = "none";
    videoElement.style.width = "250px";
    videoElement.style.transform = "scale(-1, 1)";

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

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceMesh.send({image: videoElement});
      },
      width: 640,
      height: 480
    });
    camera.start();
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