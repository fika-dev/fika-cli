import { ExecuteGitCommand } from "@/domain/git-command/command.types";

export interface ICmdService {
  excuteGitCommand: ExecuteGitCommand;
}