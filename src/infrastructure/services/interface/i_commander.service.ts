import { GitCommandExecuter } from "@/domain/git-command/command.types";

export interface ICmdService {
  excuteGitCommand: GitCommandExecuter;
}
