import { Command } from "commander";
import { checkoutDevelopBranchAction } from "./checkout-develop-branch.action";

export const initCommand = new Command()
  .command("d")
  .description("checking out to develop branch")
  .action(async () => {
    await checkoutDevelopBranchAction();
  });
