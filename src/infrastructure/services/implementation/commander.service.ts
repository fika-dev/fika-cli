import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import {
  GitCommand,
  GitCommandError,
  GitCommandExecuter,
  GitCommandResult,
  Success,
} from "@/domain/git-command/command.types";
import { exec } from "child_process";
import { inject } from "inversify";
import { promisify } from "util";
import { ICmdService } from "../interface/commander.service";
import * as E from "fp-ts/Either";
class GitCommanderServie implements ICmdService {
  private _gitRepoPath: string;
  constructor(@inject(PARAMETER_IDENTIFIER.GitRepoPath) gitRepoPath: string) {
    this._gitRepoPath = gitRepoPath;
  }

  public excuteGitCommand: GitCommandExecuter = async gitCommand => {
    try {
      let command: string;
      if (process.platform == "win32") {
        const windowsCommand = gitCommand.windowsCommand ?? gitCommand.command;
        command = `git ${windowsCommand}`;
      } else {
        command = `LC_ALL=C git ${gitCommand.command}`;
      }
      const result = await this.exec(command);
      return E.right({
        output: result.stdout + result.stderr,
      }) as GitCommandResult;
    } catch (e) {
      const message = e.stdout + e.stderr;
      return E.left(message) as GitCommandResult;
    }
  };

  private async exec(command: string) {
    const execP = promisify(exec);
    return await execP(command, { cwd: this._gitRepoPath });
  }
}
