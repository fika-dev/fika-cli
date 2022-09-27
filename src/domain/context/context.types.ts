import { DomainError, Unit } from "../general/general.types";
import { Command, ExecuteGitCommand, GitCommand } from "../git-command/command.types";
import { CmdContext } from "./cmd-context/cmd-context.types";
import { GitContext, CmdOutputParser } from "./git-context/git-context.types";
import * as T from "fp-ts/Task";

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

export type CheckContext = (
  excuteGitCommand: ExecuteGitCommand
) => (key: ContextKey) => T.Task<ContextValue | DomainError>;

export interface CommandAndParser {
  command: Command;
  parser: CmdOutputParser;
}
