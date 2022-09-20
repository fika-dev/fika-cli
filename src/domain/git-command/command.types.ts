import * as E from "fp-ts/Either";
type MainCommand = string;
export interface GitCommand {
  command: MainCommand;
  windowsCommand?: MainCommand;
}

export type GitCommandResult = E.Either<Success, GitCommandError>;
export interface Success {
  output?: string;
}
export type GitCommandError = string;
export type GitCommandExecuter = (gitCommand: GitCommand) => Promise<GitCommandResult>;
