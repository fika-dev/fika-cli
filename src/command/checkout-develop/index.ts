import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { checkoutDevelopBranchAction } from "./checkout-develop-branch.action";

export const checkoutDevelopCommand = new Command()
  .command("d")
  .description("checking out to develop branch")
  .action(async () => {
    commandWrapper(checkoutDevelopBranchAction);
  });
