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
  mergeConflictStatusPattern,
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
const listFilter = f => (inputList: any[]) => inputList.filter(f);

export const checkHeadParser: GitOutputParser = result => !patternMatchedOrNot(headPattern)(result);
export const checkUnstagedChangeParser: GitOutputParser =
  patternMatchedOrNot(unstagedChangePattern);
export const checkUntrackedFilesParser: GitOutputParser =
  patternMatchedOrNot(untrackedFilesPattern);
export const checkStagedChangesParser: GitOutputParser = patternMatchedOrNot(stagedChangesPattern);
export const checkMergeConflict: GitOutputParser = patternMatchedOrNot(mergeConflictStatusPattern);

export const checkRemoteOrigin: GitOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(noRemote),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateHttpsGithubAddress(preprocessed)),
    E.alt(() => validateSshGithubAddress(preprocessed)),
    E.getOrElse(e => e as DomainError)
  );
};

export const checkCurrentBranch: GitOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(noHeadDefined),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateBranchName(preprocessed)),
    E.getOrElse(e => e as DomainError)
  );
};

export const parseBranches: GitOutputParser = result => {
  return pipe(
    result,
    trim,
    splitToList("\n"),
    listMap(trim),
    listFilter((branch: string) => branch.length > 0)
  );
};
