import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { pullAction } from "./pull.action";

export const pullCommand = new Command()
  .command("pull")
  .argument("[branchName]", "branch name to pull from")
  .description("pull from a codebase repo")
  .action(async (branchName?: string) => {
    commandWrapper(pullAction, branchName);
  });
