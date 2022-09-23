import { checkContext } from "@/domain/context/context.functions";
import { ContextKey, ContextValue } from "@/domain/context/context.types";
import { ExecuteGitCommand } from "@/domain/git-command/command.types";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { DefinedRule, IsContextRule } from "../rule.types";
import { ValidationResolverBuilder } from "./validation-rule.types";

const isContextRule: IsContextRule =
  (key: ContextKey, expectedValue: ContextValue) => async (excuteGitCommand: ExecuteGitCommand) =>
    (await checkContext(excuteGitCommand)(key)()) === expectedValue;

const isNotContextRule: IsContextRule =
  (key: ContextKey, expectedValue: ContextValue) => async (excuteGitCommand: ExecuteGitCommand) =>
    (await checkContext(excuteGitCommand)(key)()) !== expectedValue;

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

export const isGitCleanStatus: DefinedRule = async (excuteGitCommand: ExecuteGitCommand) => {
  const rules = [
    headExists,
    unstagedChangesNotExist,
    conflictNotExist,
    untrackedFilesNotExist,
    stagedChangesNotExist,
    isRemoteNotEmpty,
  ];

  const ruleResults = await Promise.all(rules.map(rule => rule(excuteGitCommand)));
  return ruleResults.every(result => result === true);
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
