import { Context, ContextKey, ContextValue } from "../context/context.types";
import { ExecuteCommand, ExecuteGitCommand } from "../git-command/command.types";

export type IsContextRule = (key: ContextKey, expectedValue: ContextValue) => DefinedRule;
export type AmongContextRule = (
  key: ContextKey
) => (values: ContextValue[]) => (context: Context) => boolean;
type Not = (toBeOpposite: boolean) => boolean;
export type Rule = IsContextRule | AmongContextRule;
export type DefinedRule = (excuteGitCommand: ExecuteCommand) => Promise<boolean>;
export type RuleCombinator = (...ruleResults: Rule[]) => (context: Context) => boolean;
