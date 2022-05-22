import { Avatar } from "./avatar";

export abstract class Service{
  static loadAllAvatars(): Promise<Avatar[]>{
    return new Promise((resolve: any, reject: any)=>{

      let avatars = Object.keys(localStorage).filter(key=>key.startsWith("avatar_")).map((key: string)=>{
        return Avatar.fromBase64(localStorage.getItem(key));
      });

      resolve(avatars);
    });
  }

  static loadAvatar(id: string): Promise<Avatar>{
    return new Promise((resolve: any, reject: any)=>{
      resolve(Avatar.fromBase64(localStorage.getItem("avatar_" + id)));
    });
  }

  static saveAvatar(avatar: Avatar): Promise<String>{
    return new Promise((resolve: any, reject: any)=>{
      let id = "avatar_" + avatar.id;
      avatar.updateDate = new Date().toISOString();
      localStorage.setItem(id, avatar.toBase64());

      resolve(id);
    });
  }

  static deleteAvatar(id: string): Promise<boolean>{
    return new Promise((resolve: any, reject: any)=>{
      localStorage.removeItem("avatar_" + id);
      resolve(true);
    });
  }
}