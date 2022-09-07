import { Command } from "commander";
import { initAction } from "./init.action";

export const initCommand = new Command()
  .command("init")
  .description("init fika in a codebase repo")
  .action(async () => {
    await initAction();
  });
