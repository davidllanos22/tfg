import { Utils } from "./utils";

export abstract class Drawing{

  private static images = {};

  static createImage(src: string, onload: any = null){
    let base = (import.meta as any).env.BASE_URL;

    if(this.images[src]){
      if(onload) onload(this.images[src]);
      return;
    }

    let image = new Image();
    image.src = base + "assets/" + src;
    image.onload = ()=>{
      this.images[src] = image;
      if(onload) onload(image);
    }
  }

  static clearCanvas(ctx: any, width: number, height: number, color: string){
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fill();
  }

  static fillCircle(ctx: any, x: number, y: number, r: number, color: string){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }

  static drawSpriteSheet(ctx: any, img: any, x: number, y: number, tX: number, tY: number, tW: number, tH: number, flip: boolean, angle: number){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if(flip) ctx.scale(-1, 1);
    ctx.drawImage(img, tX * tW, tY * tH, tW, tH, 0, 0, tW, tH);
    ctx.restore();
  }

  static drawText(ctx: any, text: string, x: number, y: number, size: number, color: string){
    ctx.font = size + "px Arial"
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  static replaceCanvasColor(cvs: any, ctx: any, from: any, to: any){
    let imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    let fromRGB = Utils.hexToRGB(from);
    let toRGB = Utils.hexToRGB(to);
  
    for (let i = 0; i < imageData.data.length; i += 4){
      let pixelRGB = [imageData.data[i], imageData.data[i+1], imageData.data[i+2]];
      if(Utils.isSameRGBColor(pixelRGB, fromRGB)){
          imageData.data[i] = toRGB[0];
          imageData.data[i+1] = toRGB[1];
          imageData.data[i+2] = toRGB[2];
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  }

  static createImageCanvas(url: string, replaceColors: any, callback: any){
    let cvs = document.createElement("canvas");
  
    Drawing.createImage(url, (image)=>{
      let ctx = cvs.getContext("2d");
  
      cvs.width = image.width;
      cvs.height = image.height;
  
      ctx.drawImage(image, 0, 0);

      replaceColors.forEach((colors: any)=>{
        Drawing.replaceCanvasColor(cvs, ctx, colors[0], colors[1]);
      });
      
      callback(cvs);
    });
    
  }
}