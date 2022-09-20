import { GitCommand, GitCommandResult } from "@/domain/git-command/command.types";
import { ContextKey, ContextValue, Exist } from "../context.types";
import * as E from "fp-ts/Either";

type RemoteRepo = string;
type Empty = "Empty";
type Branch = string;
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
export type GitContextParser = (
  result: GitCommandResult,
  patterns: GitOutputPattern[]
) => E.Either<GitErrorPattern, GitContextUpdater[]>;
export type GitContextExaminer = (
  command: GitCommand,
  parser: GitContextParser
) => GitContextUpdater;

export interface GitOutputPattern {
  key: ContextKey;
  value: ContextValue;
  pattern: GitNormalPattern | GitErrorPattern;
}
export type GitErrorPattern = string;
export type GitNormalPattern = string;
export type GitContextUpdaterBuilder = (pattern: GitOutputPattern) => GitContextUpdater;
