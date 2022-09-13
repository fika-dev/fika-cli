// import path from 'path';
import { Command } from "commander";
import { commandWrapper } from "../wrapper/wrappers";
import { connectAction } from "./connect.action";

export const connectCommand = new Command()
  .command("connect <workspaceType>")
  .description("connect")
  .action(async (workspaceType = "org") => {
    commandWrapper(connectAction, workspaceType);
  });
