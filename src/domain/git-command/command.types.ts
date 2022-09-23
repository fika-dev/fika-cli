import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { Issue } from "../entity/issue.entity";
import { DomainError, DomainSuccess } from "../general/general.types";
type MainCommand = string;
export interface GitCommand {
  command: MainCommand;
  windowsCommand?: MainCommand;
  argument?: string;
}

export type GitCommandResult = E.Either<GitCommandError, GitCommandOutput>;
export interface GitCommandOutput extends DomainSuccess {
  output?: string;
}
export interface GitCommandError extends DomainError {
  message: string;
}
export type GitCommandExecuter = (gitCommand: GitCommand) => T.Task<GitCommandResult>;

export interface CheckoutToIssue {
  (issue: Issue): TE.TaskEither<CheckoutFailure, CheckoutSuccess>;
}

export interface CheckoutSuccess extends DomainSuccess {
  branchName: string;
}
export interface CheckoutFailure extends DomainError {
  branchName: string;
}

export type CheckoutToIssueBuilder = (exec: GitCommandExecuter) => CheckoutToIssue;
