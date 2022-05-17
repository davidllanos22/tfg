export abstract class Settings{

  public mirrorEnabled: boolean = true;
  public debugEnabled: boolean = false;

  constructor(){
    (window as any).settings = this;
  }
}