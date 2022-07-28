import { Command } from "commander";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { finishAction } from "./finish.action";

export const finishCommand = new Command()
  .command("finish")
  .description("finish current issue &\n create pull request to github &\n checkout to base branch")
  .option("--base <base-branch>", "PR into given base branch")
  .action(async option => {
    commandWrapper(finishAction, option.base);
  });
