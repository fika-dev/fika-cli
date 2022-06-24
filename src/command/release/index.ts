import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { releaseAction } from "./release.action";

export const releaseCommand = new Command()
  .command("release")
  .description(
    "checkout to release branch with current commit & generate description Notion page"
  )
  .action(async () => {
    await commandWrapper(releaseAction);
  });
