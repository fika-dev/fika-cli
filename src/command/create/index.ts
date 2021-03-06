import { Command } from "commander";
import { asyncWrapper, authWrapper } from "../wrapper/wrappers";
import { createIssueAction } from "./create-issue.action";
import { createPRAction } from "./create-pr.action";

export const createCommand = new Command()
  .command('create')
  .description('create issue or PR in github')
  .option('-i, --issue <documentUrl>', 'create issue')
  .option('-p, --pr <documentUrl>', 'create PR')
  .action( async (options: {issue: string, pr: string}) => {
    if (options.issue){
      authWrapper(createIssueAction,options.issue);
    }else if (options.pr){
      authWrapper(createPRAction,options.pr);
    }
  });

  export const createIssueShortCommand = new Command()
  .command('ci')
  .description('create issue in github')
  .argument('<document-url>')
  .action( async (argument) => {
    if (argument){
      authWrapper(createIssueAction,argument);
    }
  });

  export const createPRShortCommand = new Command()
  .command('cpr')
  .description('create PR in github')
  .argument('<document-url>')
  .action( async (argument) => {
    if (argument){
      authWrapper(createPRAction,argument);
    }
  });