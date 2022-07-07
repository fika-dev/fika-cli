import { Command } from "commander";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { createIssueAction } from "./create-issue.action";
import { createPRAction } from "./create-pr.action";

export const createCommand = new Command()
  .command("create")
  .description("create issue or PR in github")
  .option("-i, --issue <documentUrl>", "create issue")
  .option("-p, --pr <documentUrl>", "create PR")
  .option("--base <base-branch>", "create PR into given base branch")
  .action(async (options: { issue: string; pr: string; base: string }) => {
    if (options.issue) {
      commandWrapper(createIssueAction, options.issue);
    } else if (options.pr) {
      commandWrapper(createPRAction, options.pr, options.base);
    }
  });

export const createIssueShortCommand = new Command()
  .command("ci")
  .description("create issue in github")
  .argument("<document-url>")
  .action(async argument => {
    if (argument) {
      commandWrapper(createIssueAction, argument);
    }
  });

export const createPRShortCommand = new Command()
  .command("cpr")
  .description("create PR in github")
  .option("--base <base-branch>", "PR into given base branch")
  .action(async option => {
    commandWrapper(createPRAction, option.base);
  });
