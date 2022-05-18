import GUI from 'lil-gui';

export abstract class Settings{

  public mirrorEnabled: boolean = true;
  public debugEnabled: boolean = false;

  constructor(){
    (window as any).settings = this;
    
    const gui = new GUI();
    gui.close();
    gui.add(this, "mirrorEnabled");
    gui.add(this, "debugEnabled");
  }
}