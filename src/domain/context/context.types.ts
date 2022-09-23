import { Unit } from "../general/general.types";
import { GitCommand } from "../git-command/command.types";
import { CmdContext } from "./cmd-context/cmd-context.types";
import { GitContext, GitOutputParser } from "./git-context/git-context.types";

export interface Context {
  git: GitContext;
  cmd: CmdContext;
}

export type ContextDomain = keyof Context;
export type ContextField = keyof GitContext | keyof CmdContext;

export interface ContextKey {
  domain: ContextDomain;
  field: ContextField;
}

export type ContextValue = boolean | string | string[];
export type Exist = boolean;
export type GetContext = () => Context;
export type SetContext = (context: Context) => Unit;

export type HowToCheck = {
  git: {
    [key in keyof GitContext]: CommandAndParser;
  };
  cmd: {
    [key in keyof CmdContext]: CommandAndParser;
  };
};

export interface CommandAndParser {
  command: GitCommand;
  parser: GitOutputParser;
}
