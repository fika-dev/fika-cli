import {
  GitCommand,
  GitCommandError,
  GitCommandOutput,
  GitCommandResult,
} from "@/domain/git-command/command.types";
import { ContextKey, ContextValue, Exist } from "../context.types";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/Either";

type RemoteRepo = string;
type Empty = "Empty";
export type Branch = string;
type ConflictStatus = boolean;

export interface GitContext {
  head?: Exist;
  unstagedChanges?: Exist;
  untrackedFiles?: Exist;
  stagedChanges?: Exist;
  remote?: RemoteRepo | Empty;
  currentBranch?: Branch;
  localBranches?: Branch[];
  remoteBranches?: Branch[];
  conflict?: ConflictStatus;
}

export type GitContextUpdater = (gitContext: GitContext) => GitContext;
export type GitOutputParser = (
  patterns: GitOutputPattern[]
) => (output: GitCommandOutput) => E.Either<GitCommandError, GitOutputPattern>;
export type GitContextExaminer = (
  command: GitCommand,
  parser: GitOutputPattern
) => GitContextUpdater;

export interface GitOutputPattern {
  key: ContextKey;
  value: ContextValue;
  pattern: GitNormalPattern | GitErrorPattern;
}
export type GitErrorPattern = string;
export type GitNormalPattern = string;
export type GitContextUpdaterBuilder = (pattern: GitOutputPattern) => GitContextUpdater;
