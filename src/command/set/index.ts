import { Command } from "commander";
import { setAction } from "./set.action";

export const setCommand = new Command()
  .command('set')
  .description('set Notion bot id')
  .argument('<notion-bot-id>')
  .action( async (argument) => {
    setAction(argument);
  });