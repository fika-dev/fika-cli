import { Context, ContextKey, ContextValue } from "../context/context.types";

export type IsContextRule = (
  key: ContextKey
) => (value: ContextValue) => (context: Context) => boolean;
export type AmongContextRule = (
  key: ContextKey
) => (values: ContextValue[]) => (context: Context) => boolean;
type Not = (toBeOpposite: boolean) => boolean;
export type Rule = IsContextRule | AmongContextRule;
export type RuleCombinator = (...ruleResults: Rule[]) => (context: Context) => boolean;
