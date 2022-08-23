import { Command } from "commander";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { checkoutFeatureBranchAction } from "./checkout-feature-branch.action";

export const finishCommand = new Command()
  .command("finish")
  .description("checking out to the most recent feature branch")
  .action(async option => {
    commandWrapper(checkoutFeatureBranchAction);
  });
