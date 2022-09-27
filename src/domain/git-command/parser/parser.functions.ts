import {
  validateBranchName,
  validateHttpsGithubAddress,
  validateIncludeString,
  validateSshGithubAddress,
} from "@/domain/rules/validation-rules/validate.functions";
import { ValidationError } from "@/domain/rules/validation-rules/validation-rule.types";
import * as E from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import { ContextValueOrError, CmdOutputParser } from "../../context/git-context/git-context.types";
import {
  commandNotFound,
  existingGhVersion,
  existingGitVersion,
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
const keepOnlyTheFirstLine = (result: string) => result.split("\n")[0];

export const checkHeadParser: CmdOutputParser = result => !patternMatchedOrNot(headPattern)(result);
export const checkUnstagedChangeParser: CmdOutputParser =
  patternMatchedOrNot(unstagedChangePattern);
export const checkUntrackedFilesParser: CmdOutputParser =
  patternMatchedOrNot(untrackedFilesPattern);
export const checkStagedChangesParser: CmdOutputParser = patternMatchedOrNot(stagedChangesPattern);
export const checkMergeConflict: CmdOutputParser = patternMatchedOrNot(mergeConflictStatusPattern);

export const checkRemoteOrigin: CmdOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(noRemote),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateHttpsGithubAddress(preprocessed)),
    E.alt(() => validateSshGithubAddress(preprocessed)),
    E.getOrElse((e: ValidationError) => {
      return e as ContextValueOrError;
    })
  );
};

export const checkGitVersion: CmdOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(commandNotFound),
      E.chain(_ => E.right("NotInstalled"))
    ),
    E.alt(() => validateIncludeString(existingGitVersion)(preprocessed)),
    E.getOrElse((e: ValidationError) => {
      return e as ContextValueOrError;
    })
  );
};

export const checkGhCliVersion: CmdOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(commandNotFound),
      E.chain(_ => E.right("NotInstalled"))
    ),
    E.alt(() => pipe(preprocessed, keepOnlyTheFirstLine, validateIncludeString(existingGhVersion))),
    E.getOrElse((e: ValidationError) => {
      return e as ContextValueOrError;
    })
  );
};

export const checkCurrentBranch: CmdOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(noHeadDefined),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateBranchName(preprocessed)),
    E.getOrElse((e: ValidationError) => {
      return e as ContextValueOrError;
    })
  );
};

export const parseBranches: CmdOutputParser = result => {
  return pipe(
    result,
    trim,
    splitToList("\n"),
    listMap(trim),
    listFilter((branch: string) => branch.length > 0)
  );
};
