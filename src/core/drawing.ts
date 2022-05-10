export abstract class Drawing{
  static createImage(src: string){
    let image = new Image();
    image.src = "./assets/" + src;

    return image;
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

  static drawSpriteSheet(ctx: any, img: any, x: number, y: number, tX: number, tY: number, flip: boolean, angle: number){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if(flip) ctx.scale(-1, 1);
    ctx.drawImage(img, tX * 16, tY * 16, 16, 16, 0, 0, 16, 16);
    ctx.restore();
  }

  static drawText(ctx: any, text: string, x: number, y: number, size: number, color: string){
    ctx.font = size + "px Arial"
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
}