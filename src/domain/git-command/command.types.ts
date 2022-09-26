import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { Issue } from "../entity/issue.entity";
import { DomainError, DomainSuccess } from "../general/general.types";
type MainCommand = string;
export interface GitCommand {
  command: MainCommand;
  windowsCommand?: MainCommand;
  argument?: string;
}

export type GitCommandOutput = string;
export type ExecuteGitCommand = (gitCommand: GitCommand) => T.Task<GitCommandOutput>;

export interface CheckoutToIssue {
  (issue: Issue): TE.TaskEither<CheckoutFailure, CheckoutSuccess>;
}

export interface CheckoutSuccess extends DomainSuccess {
  branchName: string;
}
export interface CheckoutFailure extends DomainError {
  branchName: string;
}

export type CheckoutToIssueBuilder = (exec: ExecuteGitCommand) => CheckoutToIssue;
