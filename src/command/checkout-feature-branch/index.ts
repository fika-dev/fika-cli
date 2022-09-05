import { Command } from "commander";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { checkoutFeatureBranchAction } from "./checkout-feature-branch.action";

export const checkoutFeatureBranchCommand = new Command()
  .command("f")
  .description("checking out to the most recent local feature branch")
  .argument("<issue-number>", "issue number to checkout", undefined)
  .action(async argument => {
    commandWrapper(checkoutFeatureBranchAction, argument);
  });
