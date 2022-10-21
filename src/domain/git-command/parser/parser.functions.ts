import { issueNumberTag } from "@/config/constants/default_config";
import { DomainError } from "@/domain/general/general.types";
import {
  validateBranchName,
  validateHttpsGithubAddress,
  validateIncludeString,
  validateSshGithubAddress,
} from "@/domain/rules/validation-rules/validate.functions";
import * as E from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import { CmdOutputParser, ContextValueOrError } from "../../context/git-context/git-context.types";
import { OutputPattern } from "./parser.type";
import {
  commandNotFound,
  errorPattern,
  existingGhVersion,
  existingGitVersion,
  fatalPattern,
  headPattern,
  mergeConflictStatusPattern,
  noHeadDefined,
  noRemote,
  pullOutputPatterns,
  stagedChangesPattern,
  unstagedChangePattern,
  untrackedFilesPattern,
} from "./parser.values";

const isPatternMatched = (pattern: string) => (result: string) => {
  const lowerCaseResult = result.toLowerCase();
  const lowerCasePattern = pattern.toLowerCase();
  return lowerCaseResult.includes(lowerCasePattern) ? true : false;
};

const isResultMatchedWith = (result: string) => (outputPattern: OutputPattern) => {
  const lowerCaseResult = result.toLowerCase();
  const lowerCasePattern = outputPattern.pattern.toLowerCase();
  return lowerCaseResult.includes(lowerCasePattern) ? true : false;
};

const isPatternMatchedInFront = (pattern: string) => (result: string) => {
  const lowerCaseResult = result.toLowerCase();
  const lowerCasePattern = pattern.toLowerCase();
  return lowerCaseResult.startsWith(lowerCasePattern) ? true : false;
};
const trim = (result: string) => result.trim();
const splitToList = (seperator: string) => (result: string) => result.split(seperator);
const listMap = f => (inputList: any[]) => inputList.map(f);
const listFilter = f => (inputList: any[]) => inputList.filter(f);
const listFind = f => (inputList: any[]) => inputList.find(f);
const keepOnlyTheFirstLine = (result: string) => result.split("\n")[0];

const httpsGithubAddressPattern: RegExp = /https\:\/\/github\.com\/(.+)\/(.+)\.git/g;
const sshGithubAddressPattern: RegExp = /git\@github.com\:(.+)\/(.+)\.git/g;
const parseGithubUrlUsingRegex = (re: RegExp) => (result: string) => {
  re.lastIndex = 0;
  const matched = re.exec(result);
  if (matched) {
    const [, owner, repo] = matched;
    return E.right(`https://github.com/${owner}/${repo}`);
  } else {
    return E.left({
      type: "ValidationError",
      subType: "NotHttpAddress",
      value: result,
    } as DomainError);
  }
};

const parseGithubUrlFromHttps = parseGithubUrlUsingRegex(httpsGithubAddressPattern);
const parseGithubUrlFromSsh = parseGithubUrlUsingRegex(sshGithubAddressPattern);

export const isFeatureBranch = (issueBranchPattern: string) => (log: string) => {
  const pt = issueBranchPattern.replace(issueNumberTag, "(\\d{1,6})");
  const re = new RegExp(pt);
  return re.test(log);
};

export const checkHeadParser: CmdOutputParser = result => !isPatternMatched(headPattern)(result);
export const checkUnstagedChangeParser: CmdOutputParser = isPatternMatched(unstagedChangePattern);
export const checkUntrackedFilesParser: CmdOutputParser = isPatternMatched(untrackedFilesPattern);
export const checkStagedChangesParser: CmdOutputParser = isPatternMatched(stagedChangesPattern);
export const checkMergeConflict: CmdOutputParser = isPatternMatched(mergeConflictStatusPattern);

export const parseRemoteAddress: CmdOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    flow(
      validateIncludeString(noRemote),
      E.chain(_ => E.right("Empty"))
    ),
    E.alt(() => validateHttpsGithubAddress(preprocessed)),
    E.alt(() => validateSshGithubAddress(preprocessed)),
    E.getOrElse((e: DomainError) => {
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
    E.getOrElse((e: DomainError) => {
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
    E.getOrElse((e: DomainError) => {
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
    E.getOrElse((e: DomainError) => {
      return e as ContextValueOrError;
    })
  );
};

export const parseMultipleLines: CmdOutputParser = result => {
  return pipe(
    result,
    trim,
    splitToList("\n"),
    listMap(trim),
    listFilter((line: string) => line.length > 0)
  );
};

export const parsePullOutput: CmdOutputParser = result => {
  const found = pipe(pullOutputPatterns, listFind(isResultMatchedWith(result))) as
    | OutputPattern
    | undefined;
  if (found) {
    return found.value;
  } else {
    throw {
      type: "GitError",
      subType: "NotMatchedPullOutput",
      value: result,
    } as DomainError;
  }
};

export const checkNoError: CmdOutputParser = result => {
  const errorPatterns = [errorPattern, fatalPattern];
  const isThereError = errorPatterns
    .map(pattern => isPatternMatchedInFront(pattern)(result))
    .every(v => v);
  return isThereError
    ? ({
        type: "GitError",
        subType: "ErrorMessageFound",
        value: result,
      } as DomainError)
    : true;
};

export const checkNoErrorAndReturnOutput: CmdOutputParser = result => {
  const errorPatterns = [errorPattern, fatalPattern];
  const isThereError = errorPatterns
    .map(pattern => isPatternMatchedInFront(pattern)(result))
    .every(v => v);
  return isThereError
    ? ({
        type: "GitError",
        subType: "ErrorMessageFound",
        value: result,
      } as DomainError)
    : result.trim();
};

export const parseGithubUrl: CmdOutputParser = result => {
  const preprocessed = pipe(result, trim);
  return pipe(
    preprocessed,
    parseGithubUrlFromHttps,
    E.alt(() => parseGithubUrlFromSsh(preprocessed)),
    E.getOrElse((e: DomainError) => {
      return e as ContextValueOrError;
    })
  );
};
