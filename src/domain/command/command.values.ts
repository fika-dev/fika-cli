import { Command } from "../git-command/command.types";

export const gitVersionCheckCommand: Command = {
  command: "git --version",
};
export const ghCliVersionCommand: Command = {
  command: "gh --version",
};
