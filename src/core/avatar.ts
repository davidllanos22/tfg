import { Utils } from "./utils";

export type AvatarPart = {image: string, x: number, y: number};
export type AvatarColors = { background?: string, skin?: string, skinDark?: string, clothes?: string, clothesDark?: string, hair?: string, hairDark?: string, eyes?: string};

export const AvatarLandmarks = [0, 1, 6, 17, 55, 52, 70, 61, 291, 285, 282, 276, 160, 158, 144, 153, 385, 387, 380, 373, 10, 152, 454, 234];

export const DefaultColors: AvatarColors = {
  background: "#ffffff",
  skin: "#eec39a",
  skinDark: "#d9a066",
  clothes: "#9badb7",
  clothesDark: "#847e87",
  hair: "#222034",
  hairDark: "#000000",
  eyes: "#663931"
}


export class Avatar{
  private _id: string;
  private _version: string;
  private _name: string;
  private _shape: AvatarPart;
  private _mouth: AvatarPart;
  private _nose: AvatarPart;
  private _eyes: AvatarPart;
  private _eyebrows: AvatarPart;
  private _hair: AvatarPart;
  private _colors: AvatarColors = {...DefaultColors};

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get version(): string {
    return this._version;
  }

  public set version(value: string) {
    this._version = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public set colors(value: AvatarColors) {
    this._colors = value;
  }

  public get colors(): AvatarColors {
    return this._colors;
  }

  public get shape(): AvatarPart {
    return this._shape;
  }

  public set shape(value: AvatarPart) {
    this._shape = value;
  }

  public get mouth(): AvatarPart {
    return this._mouth;
  }

  public set mouth(value: AvatarPart) {
    this._mouth = value;
  }

  public get nose(): AvatarPart {
    return this._nose;
  }

  public set nose(value: AvatarPart) {
    this._nose = value;
  }

  public get eyes(): AvatarPart {
    return this._eyes;
  }

  public set eyes(value: AvatarPart) {
    this._eyes = value;
  }

  public get eyebrows(): AvatarPart {
    return this._eyebrows;
  }

  public set eyebrows(value: AvatarPart) {
    this._eyebrows = value;
  }

  public get hair(): AvatarPart {
    return this._hair;
  }

  public set hair(value: AvatarPart) {
    this._hair = value;
  }
  
  public toJSON(){
    let data: any = {};

    data.id = this.id;
    data.version = this.version;
    data.name = this.name;
    data.colors = this.colors;

    return JSON.stringify(data);
  }

  public toBase64(){
    return btoa(this.toJSON());
  }

  static fromBase64(data: string){
    let json;

    try{
      json = JSON.parse(atob(data));
    }catch(e){
      return null;
    }
    return Avatar.fromJSON(json);
  }

  static fromJSON(data: any): Avatar {
    let avatar = new Avatar();
    
    Object.keys(data).forEach((key: string)=>{
      avatar[key] = data[key];
    });

    return avatar;
  }

  static random(): Avatar{
    let avatar = new Avatar();

    avatar.id = Utils.randomId();
    avatar.version = "1";

    let hair = Utils.randomRGBColor();
    let hairDark = hair.map(c=>Math.max(0, c-20));
    let skin = Utils.randomRGBColor();
    let skinDark = skin.map(c=>Math.max(0, c-20));
    let clothes = Utils.randomRGBColor();
    let clothesDark = clothes.map(c=>Math.max(0, c-20));

    avatar.colors.background = Utils.randomHexColor();
    avatar.colors.hair = Utils.RGBtoHex(hair);
    avatar.colors.hairDark = Utils.RGBtoHex(hairDark);
    avatar.colors.skin = Utils.RGBtoHex(skin);
    avatar.colors.skinDark = Utils.RGBtoHex(skinDark);
    avatar.colors.clothes = Utils.RGBtoHex(clothes);
    avatar.colors.clothesDark = Utils.RGBtoHex(clothesDark);

    return avatar;
  }
}