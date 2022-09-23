import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/Task";
import { ExecuteGitCommand } from "../git-command/command.types";
import { CheckContext, CommandAndParser } from "./context.types";
import { howToCheck } from "./how-to-check.values";

export const checkContext: CheckContext = (excuteGitCommand: ExecuteGitCommand) => key => {
  const commandAndParser = howToCheck[key.domain][key.field] as CommandAndParser;
  return pipe(
    commandAndParser.command,
    excuteGitCommand,
    T.map(output => commandAndParser.parser)
  );
};
