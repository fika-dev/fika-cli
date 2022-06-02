import { Command } from "commander";
import { authHandler } from "../auth/auth-handler";
import { asyncWrapper, authWrapper } from "../wrapper/wrappers";
import { setAction } from "./set.action";

export const setCommand = new Command()
  .command('set')
  .description('set Notion bot id')
  .argument('<notion-bot-id>')
  .action( async (argument: string) => {
    await authWrapper(setAction, argument)
  });