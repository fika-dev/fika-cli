import { ExecuteCommand, ExecuteGitCommand } from "@/domain/git-command/command.types";

export interface ICommanderService {
  excuteGitCommand: ExecuteGitCommand;
  excuteCommand: ExecuteCommand;
}
