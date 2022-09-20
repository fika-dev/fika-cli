import { Context, ContextKey, ContextValue } from "../context/context.types";

type ExpectedCondition = boolean | string | string[];
export type IsContextRule = (
  key: ContextKey
) => (value: ContextValue) => (context: Context) => boolean;
export type AmongContextRule = (
  key: ContextKey
) => (values: ContextValue[]) => (context: Context) => boolean;
type Not = (toBeOpposite: boolean) => boolean;
type RuleCombinator = (...rules: boolean[]) => boolean;
