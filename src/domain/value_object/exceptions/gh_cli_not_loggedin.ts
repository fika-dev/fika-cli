export const NEED_LOGIN_STRING = 'gh auth login';
export class GHCliNotLoggedin extends Error{
  constructor(name?: string, message?: string){
    super();
    this.name = name;
    if (message){
      this.message = message;
    }
  }
}