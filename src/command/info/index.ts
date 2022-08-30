import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { infoAction } from "./info.action";

export const infoCommand = new Command()
  .command("info")
  .description("display information about the current branch")
  .action(async () => {
    commandWrapper(infoAction);
  });
