import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { pullAction } from "./pull.action";

export const initCommand = new Command()
  .command("pull")
  .description("pull from a codebase repo")
  .action(async () => {
    commandWrapper(pullAction);
  });
