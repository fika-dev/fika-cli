import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import { GitCommandError, GitCommandExecuter } from "@/domain/git-command/command.types";
import { exec } from "child_process";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { inject } from "inversify";
import { promisify } from "util";
import { ICmdService } from "../interface/i_commander.service";
class GitCommanderServie implements ICmdService {
  private _gitRepoPath: string;
  constructor(@inject(PARAMETER_IDENTIFIER.GitRepoPath) gitRepoPath: string) {
    this._gitRepoPath = gitRepoPath;
  }

  public excuteGitCommand: GitCommandExecuter = gitCommand => {
    return pipe(
      TE.tryCatch(
        () => {
          let command: string;
          if (process.platform == "win32") {
            const windowsCommand = gitCommand.windowsCommand ?? gitCommand.command;
            command = `git ${windowsCommand}`;
          } else {
            command = `LC_ALL=C git ${gitCommand.command}`;
          }
          return this.exec(command);
        },
        (e: any) => {
          return { message: e };
        }
      ),
      TE.map(result => {
        return {
          output: result.stdout + result.stderr,
        };
      })
    );
  };

  private async exec(command: string) {
    try {
      const execP = promisify(exec);
      return await execP(command, { cwd: this._gitRepoPath });
    } catch (e) {
      const message = e.stdout + e.stderr;
      return message;
    }
  }
}
