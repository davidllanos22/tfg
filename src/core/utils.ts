export abstract class Utils{
  static RGBtoHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1]  << 8) + rgb[2] ).toString(16).slice(1);
  }

  static randomRGBColor(){
    let rgb = [];

    for(let i = 0; i < 3; i++){
      rgb.push(Math.floor(Math.random() * 255));
    }

    return rgb;
  }

  static randomHexColor(){
    let rgb = this.randomRGBColor();
    return this.RGBtoHex(rgb);
  }

  static isSameRGBColor(a: any, b: any){
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
  }

  static randomId(){
    return "" + Math.random().toString(36).substr(2, 9);
  }

  static randomInt(from: number, to: number){
    return Math.floor(Math.random() * (to + 1) + from);
  }
}