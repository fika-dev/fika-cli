import { CheckoutToIssueBuilder, ExecuteGitCommand, GitCommand } from "./command.types";
import { createAndCheckoutCmd } from "./git-command.values";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/lib/function";
import produce from "immer";
import { ValidateContext, ValidationError } from "../rules/validation-rules/validation-rule.types";
import { DomainError, Unit } from "../general/general.types";
import { Domain } from "domain";
import { CommandAndParser, Context, ContextValue } from "../context/context.types";
import { RuleCombinator } from "../rules/rule.types";

export const getGitCommandWithArgument =
  (gitCommand: GitCommand) =>
  (...params: string[]) => {
    return {
      ...gitCommand,
      argument: params.join(" "),
    };
  };

export const executeAndParseGitCommand =
  (excuteGitCommand: ExecuteGitCommand) =>
  (commandAndParser: CommandAndParser): T.Task<ContextValue | DomainError> => {
    return pipe(
      commandAndParser.command,
      excuteGitCommand,
      T.map(output => commandAndParser.parser(output))
    );
  };

// const pushCommandWithOriginMaster = getGitCommandWithArgument(pushBranchCmd)("origin", "master");

//
// export const checkoutToIssueBuilder: CheckoutToIssueBuilder = exec => issue => {
//   return pipe(
//     issue.branchName,
//     E.fromNullable({
//       type: "UndefinedBranchNameError",
//       value: undefined,
//     } as ValidationError),
//     E.chainFirst(() => validateCheckOut(getContext)(setContext)(isCheckOutOkRule)),
//     E.map(branchName =>
//       produce(createAndCheckoutCmd, cmd => {
//         cmd.argument = branchName;
//       })
//     ),
//     TE.fromEither,
//     TE.mapLeft(e => e as DomainError),
//     TE.chain(exec),
//     TE.mapLeft(e => e as DomainError),
//     // TE.chainEitherK(gitResultParser([])),
//     TE.map(pattern => {
//       return {
//         branchName: issue.branchName,
//       };
//     }),
//     TE.mapLeft(e => {
//       return {
//         branchName: issue.branchName,
//       };
//     })
//   );
// };

declare function getContext(): Context;
declare function setContext(context: Context): Unit;
declare const validateCheckOut: ValidateContext;
declare const isCheckOutOkRule: RuleCombinator;
