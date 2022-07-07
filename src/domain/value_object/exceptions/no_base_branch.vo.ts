import BaseException from "./base_exception";

export const NO_BASE_BRANCH_STRING = "Base ref must be a branch";
export const NO_BASE_BRANCH_MESSAGE = "no base branch is found";
export class NoBaseBranch extends BaseException {}
