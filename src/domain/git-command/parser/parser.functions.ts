import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import produce from "immer";
import {
  GitContextParser,
  GitContextUpdaterBuilder,
  GitOutputPattern,
} from "../../context/git-context/git-context.types";
import { GitCommandError } from "../command.types";

const gitStatusParser: GitContextParser = (result, patterns) => {
  return pipe(
    result,
    E.foldW(
      r => {
        return E.right(patterns.filter(p => r.output.includes(p.pattern))) as E.Right<
          GitOutputPattern[]
        >;
      },
      e => {
        const found = patterns.filter(p => e.includes(p.pattern));
        const result = found.length > 0 ? E.right(found) : E.left(e);
        return result as E.Either<GitCommandError, GitOutputPattern[]>;
      }
    ),
    E.map(patterns => patterns.map(p => buildUpdater(p)))
  );
};

const buildUpdater: GitContextUpdaterBuilder = pattern => context =>
  produce(context, context => {
    context[pattern.key.domain][pattern.key.field] = pattern.value;
  });
