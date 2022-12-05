import { Command } from "commander";
import { authHandler } from "../auth/auth-handler";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { setAction } from "./set.action";

export const setCommand = new Command()
  .command("set")
  .description("set Notion bot id")
  .argument("[notion-bot-id]", undefined)
  .action(async (argument?: string) => {
    await commandWrapper(setAction, argument);
  });
