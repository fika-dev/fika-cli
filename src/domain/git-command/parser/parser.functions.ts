import { DomainError } from "@/domain/general/general.types";
import {
  validateBranchName,
  validateHttpsGithubAddress,
  validateIncludeString,
  validateSshGithubAddress,
} from "@/domain/rules/validation-rules/validate.functions";
import * as E from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import { GitOutputParser, GitOutputPattern } from "../../context/git-context/git-context.types";
import { GitCommandError } from "../command.types";
import {
  headPattern,
  mergeConflictPattern,
  noHeadDefined,
  noRemote,
  stagedChangesPattern,
  unstagedChangePattern,
  untrackedFilesPattern,
} from "./parser.values";

const patternMatchedOrNot = (pattern: string) => (result: string) => {
  return result.includes(pattern) ? true : false;
};
const trim = (result: string) => result.trim();
const splitToList = (seperator: string) => (result: string) => result.split(seperator);
const listMap = f => (inputList: any[]) => inputList.map(f);

export const checkHeadParser: GitOutputParser = patternMatchedOrNot(headPattern);
export const checkUnstagedChangeParser: GitOutputParser =
  patternMatchedOrNot(unstagedChangePattern);
export const checkUntrackedFilesParser: GitOutputParser =
  patternMatchedOrNot(untrackedFilesPattern);
export const checkStagedChangesParser: GitOutputParser = patternMatchedOrNot(stagedChangesPattern);
export const checkMergeConflict: GitOutputParser = patternMatchedOrNot(mergeConflictPattern);

export const checkRemoteOrigin: GitOutputParser = result => {
  return pipe(
    result,
    trim,
    flow(
      validateIncludeString(noRemote),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateHttpsGithubAddress(result)),
    E.alt(() => validateSshGithubAddress(result)),
    E.getOrElse(e => e as DomainError)
  );
};

export const checkCurrentBranch: GitOutputParser = result => {
  return pipe(
    result,
    trim,
    flow(
      validateIncludeString(noHeadDefined),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateBranchName(result)),
    E.getOrElse(e => e as DomainError)
  );
};

export const parseBranches: GitOutputParser = result => {
  return pipe(result, trim, splitToList("\n"), listMap(trim));
};

export const parseNormalResult = (patterns: GitOutputPattern[]) => (toBeMatched: string) =>
  patterns.filter(p => toBeMatched.includes(p.pattern));
export const parseErrorResult = (patterns: GitOutputPattern[]) => (toBeMatched: string) => {
  const found = patterns.filter(p => toBeMatched.includes(p.pattern));
  const result = found.length > 0 ? E.right(found) : E.left(toBeMatched);
  return result as E.Either<GitCommandError, GitOutputPattern[]>;
};

const parsePattern = (patterns: GitOutputPattern[]) => (toBeMatched: string) => {
  const found = patterns.find(p => toBeMatched.includes(p.pattern));
  const result = found ? E.right(found) : E.left(toBeMatched);
  return result as E.Either<GitCommandError, GitOutputPattern>;
};
