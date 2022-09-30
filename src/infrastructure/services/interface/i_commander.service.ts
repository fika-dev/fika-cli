import { ExecuteCommand, ExecuteGitCommand } from "@/domain/git-command/command.types";

export interface ICommanderService {
  executeGitCommand: ExecuteGitCommand;
  executeCommand: ExecuteCommand;
}
