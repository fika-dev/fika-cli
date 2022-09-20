import { GitCommandExecuter } from "@/domain/git-command/command.types";

export interface IGitCommanderService {
  excute: GitCommandExecuter;
}
