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
      let avatar = localStorage.getItem("avatar_" + id);

      resolve(avatar);
    });
  }

  static saveAvatar(avatar: Avatar): Promise<String>{
    return new Promise((resolve: any, reject: any)=>{
      let id = "avatar_" + avatar.id;
      localStorage.setItem(id, avatar.toBase64());

      resolve(id);
    });
  }
}