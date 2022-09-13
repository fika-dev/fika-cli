import { Command } from "commander";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { checkoutFeatureBranchAction } from "./checkout-feature-branch.action";

export const checkoutFeatureBranchCommand = new Command()
  .command("f")
  .description(
    "checking out to given <issue-number> feature branch, without the argument <issue-number> checkout to the most recent local feature branch"
  )
  .argument("[issue-number]", "issue number to checkout", undefined, undefined)
  .action(async (argument?: string) => {
    commandWrapper(checkoutFeatureBranchAction, argument);
  });
