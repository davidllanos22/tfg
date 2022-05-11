export abstract class Settings{

  public mirrorEnabled: boolean = true;

  constructor(){
    (window as any).settings = this;
  }
}