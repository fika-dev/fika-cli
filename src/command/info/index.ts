import { Command } from "commander";
import { infoAction } from "./info.action";

export const initCommand = new Command()
  .command("info")
  .description("display information about the current branch")
  .action(async () => {
    await infoAction();
  });
