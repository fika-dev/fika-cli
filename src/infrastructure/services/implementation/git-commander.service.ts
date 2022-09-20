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
import { IGitCommanderService } from "../interface/i-git-commander.service";
import * as E from "fp-ts/Either";
class GitCommanderServie implements IGitCommanderService {
  private _gitRepoPath: string;
  constructor(@inject(PARAMETER_IDENTIFIER.GitRepoPath) gitRepoPath: string) {
    this._gitRepoPath = gitRepoPath;
  }

  public excute: GitCommandExecuter = async gitCommand => {
    try {
      const result = await this.execP(gitCommand);
      return E.right({
        output: result.stdout + result.stderr,
      }) as GitCommandResult;
    } catch (e) {
      const message = e.stdout + e.stderr;
      return E.left(message) as GitCommandResult;
    }
  };

  private async execP(command: GitCommand) {
    const execP = promisify(exec);
    if (process.platform == "win32") {
      const windowsCommand = command.windowsCommand ?? command.command;
      return await execP(`git ${windowsCommand}`, { cwd: this._gitRepoPath });
    } else {
      return await execP(`LC_ALL=C git ${command.windowsCommand}`, { cwd: this._gitRepoPath });
    }
  }
}
