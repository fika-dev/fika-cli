import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import { ExecuteGitCommand, ExecuteCommand } from "@/domain/git-command/command.types";
import { exec } from "child_process";
import { inject, injectable } from "inversify";
import { promisify } from "util";
import { ICommanderService } from "../interface/i_commander.service";
@injectable()
export class CommanderService implements ICommanderService {
  private _gitRepoPath: string;
  constructor(@inject(PARAMETER_IDENTIFIER.GitRepoPath) gitRepoPath: string) {
    this._gitRepoPath = gitRepoPath;
  }

  public executeGitCommand: ExecuteGitCommand = gitCommand => {
    let command: string;
    if (process.platform == "win32") {
      const windowsCommand = gitCommand.windowsCommand ?? gitCommand.command;
      command = `git ${windowsCommand}  ${gitCommand.argument}`;
    } else {
      command = `LC_ALL=C git ${gitCommand.command} ${gitCommand.argument}`;
    }
    return () => this.exec(command);
  };

  public executeCommand: ExecuteCommand = command => {
    let execCommand: string;
    if (process.platform == "win32") {
      const windowsCommand = command.windowsCommand ?? command.command;
      execCommand = windowsCommand;
    } else {
      execCommand = `LC_ALL=C  ${command.command} ${command.argument}`;
    }
    return () => this.exec(execCommand);
  };

  private async exec(command: string): Promise<string> {
    try {
      const execP = promisify(exec);
      const output = await execP(command, { cwd: this._gitRepoPath });
      const message = output.stdout + output.stderr;
      return message;
    } catch (e) {
      const message = e.stdout + e.stderr;
      return message;
    }
  }
}
