export type AvatarPart = {id: string, color: string};

export class Avatar{
  private _name: string;
  private _shape: AvatarPart;
  private _mouth: AvatarPart;
  private _nose: AvatarPart;
  private _eyes: AvatarPart;
  private _eyebrows: AvatarPart;
  private _hair: AvatarPart;

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
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


  static fromJSON(data: any): Avatar {
    let avatar = new Avatar();
    
    Object.keys(data).forEach((key: string)=>{
      avatar[key] = data[key];
    });

    return avatar;
  }
}