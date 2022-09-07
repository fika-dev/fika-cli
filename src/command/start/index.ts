import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { startAction } from "./start.action";

export const startCommand = new Command()
  .command("start")
  .description(
    "start to work with given issue \n(it creates an linked issue in github & \n checkouts to new issue branch)"
  )
  .argument("<document-url>")
  .action(async argument => {
    if (argument) {
      commandWrapper(startAction, argument);
    }
  });
