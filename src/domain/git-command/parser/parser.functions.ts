import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import produce from "immer";
import {
  GitContextUpdaterBuilder,
  GitErrorPattern,
  GitOutputParser,
  GitOutputPattern,
} from "../../context/git-context/git-context.types";
import { GitCommandError } from "../command.types";

export const gitResultParser: GitOutputParser = patterns => result =>
  pipe(result, r => parsePattern(patterns)(r.output));

export const parseNormalResult = (patterns: GitOutputPattern[]) => (toBeMatched: string) =>
  patterns.filter(p => toBeMatched.includes(p.pattern));
export const parseErrorResult = (patterns: GitOutputPattern[]) => (toBeMatched: string) => {
  const found = patterns.filter(p => toBeMatched.includes(p.pattern));
  const result = found.length > 0 ? E.right(found) : E.left(toBeMatched);
  return result as E.Either<GitCommandError, GitOutputPattern[]>;
};

const buildUpdater: GitContextUpdaterBuilder = pattern => context =>
  produce(context, context => {
    context[pattern.key.domain][pattern.key.field] = pattern.value;
  });

const parsePattern = (patterns: GitOutputPattern[]) => (toBeMatched: string) => {
  const found = patterns.find(p => toBeMatched.includes(p.pattern));
  const result = found ? E.right(found) : E.left(toBeMatched);
  return result as E.Either<GitCommandError, GitOutputPattern>;
};
