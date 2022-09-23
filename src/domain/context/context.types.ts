import { Unit } from "../general/general.types";
import { CmdContext } from "./cmd-context/cmd-context.types";
import { GitContext } from "./git-context/git-context.types";

export interface Context {
  git: GitContext;
  cmd: CmdContext;
}

export type ContextDomain = keyof Context;
export type ContextField = keyof GitContext;

export interface ContextKey {
  domain: ContextDomain;
  field: ContextField;
}

export type ContextValue = boolean | string | string[];
export type Exist = boolean;
export type GetContext = () => Context;
export type SetContext = (context: Context) => Unit;
