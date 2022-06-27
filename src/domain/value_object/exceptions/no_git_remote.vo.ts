import BaseException from "./base_exception";

export const NO_GIT_REMOTE_STRING = 'no git remotes found';
export const NO_GIT_REMOTE_MESSAGE = 'git remotes are not found';
export class NoGitRemote extends BaseException{}