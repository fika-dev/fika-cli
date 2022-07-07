import BaseException from "./base_exception";

export const PR_ALREADY_EXISTS_STRING = "already exists";
export const PR_FOR_BRANCH_STRING = "a pull request for branch";
export class GhPrAlreadyExists extends BaseException {}
