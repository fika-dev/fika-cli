import BaseException from "./base_exception";

export const SYS_CALL_STRING: string = "getaddrinfo";
export const ERROR_CODE_STRING: string = "ENOTFOUND";
export class NotOnline extends BaseException {}
