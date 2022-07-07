import BaseException from "./base_exception";

export const NEED_LOGIN_STRING = "gh auth login";
export class GHCliNotLoggedin extends BaseException {}
