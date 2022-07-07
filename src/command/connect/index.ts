// import path from 'path';
import { Command } from "commander";
import { asyncWrapper, commandWrapper } from "../wrapper/wrappers";
import { connectAction } from "./connect.action";

export const connectCommand = new Command()
  .command("connect [remoteName]")
  .description("connect")
  // .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (remoteName = "org", options: { port: string }) => {
    commandWrapper(connectAction);
  });
