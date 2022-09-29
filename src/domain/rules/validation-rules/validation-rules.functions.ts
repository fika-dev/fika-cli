import { checkContext } from "@/domain/context/context.functions";
import { ContextKey, ContextValue } from "@/domain/context/context.types";
import { Branch } from "@/domain/context/git-context/git-context.types";
import { ExecuteCommand } from "@/domain/git-command/command.types";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { DefinedRule, IsContextRule } from "../rule.types";
import { ValidationResolverBuilder } from "./validation-rule.types";

const isContextRule: IsContextRule =
  (key: ContextKey, expectedValue: ContextValue) => async (excuteGitCommand: ExecuteCommand) =>
    (await checkContext(excuteGitCommand)(key)()) === expectedValue;
const isNotContextRule: IsContextRule =
  (key: ContextKey, expectedValue: ContextValue) => async (excuteGitCommand: ExecuteCommand) =>
    (await checkContext(excuteGitCommand)(key)()) !== expectedValue;
const containsContextRule =
  (excuteGitCommand: ExecuteCommand) => async (key: ContextKey, expectedValue: ContextValue) => {
    const values = (await checkContext(excuteGitCommand)(key)()) as string[];
    const stringValue = expectedValue as string;
    const found = values.find(v => v === stringValue);
    return found === undefined ? false : true;
  };

const headExists: DefinedRule = isContextRule({ domain: "git", field: "head" }, true);
const unstagedChangesNotExist: DefinedRule = isContextRule(
  { domain: "git", field: "unstagedChanges" },
  false
);
const conflictNotExist: DefinedRule = isContextRule({ domain: "git", field: "conflict" }, false);
const untrackedFilesNotExist: DefinedRule = isContextRule(
  { domain: "git", field: "untrackedFiles" },
  false
);
const stagedChangesNotExist: DefinedRule = isContextRule(
  { domain: "git", field: "stagedChanges" },
  false
);
const isRemoteNotEmpty: DefinedRule = isNotContextRule({ domain: "git", field: "remote" }, "Empty");

const isGitInstalled: DefinedRule = isNotContextRule(
  { domain: "cmd", field: "gitVersion" },
  "NotInstalled"
);

const isGhCliInstalled: DefinedRule = isNotContextRule(
  { domain: "cmd", field: "ghCliVersion" },
  "NotInstalled"
);

export const existsLocalBranch = (executeCommand: ExecuteCommand) => async (branchName: Branch) =>
  containsContextRule(executeCommand)({ domain: "git", field: "localBranches" }, branchName);

export const existsRemoteBranch = (executeCommand: ExecuteCommand) => async (branchName: Branch) =>
  containsContextRule(executeCommand)({ domain: "git", field: "remoteBranches" }, branchName);

export const isGitAndGhCliInstalled: DefinedRule = async (executeCommand: ExecuteCommand) => {
  const rules = [isGitInstalled, isGhCliInstalled];
  const ruleResults = await Promise.all(rules.map(rule => rule(executeCommand)));
  return ruleResults.every(result => result === true);
};

export const isGitCleanStatus: DefinedRule = async (executeGitCommand: ExecuteCommand) => {
  const rules = [
    headExists,
    unstagedChangesNotExist,
    conflictNotExist,
    untrackedFilesNotExist,
    stagedChangesNotExist,
    isRemoteNotEmpty,
  ];

  const ruleResults = await Promise.all(rules.map(rule => rule(executeGitCommand)));
  return ruleResults.every(result => result === true);
};

export const isThereSomthingToStash: DefinedRule = async (executeGitCommand: ExecuteCommand) => {
  const rules = [unstagedChangesNotExist, untrackedFilesNotExist, stagedChangesNotExist];
  const ruleResults = await Promise.all(rules.map(rule => rule(executeGitCommand)));
  return ruleResults.some(result => result === true);
};

export const resolveValidationError: ValidationResolverBuilder<any> =
  errorHandler => errorOrValue =>
    pipe(
      errorOrValue,
      E.fold(
        e => errorHandler(e),
        value => O.some(value)
      )
    );
