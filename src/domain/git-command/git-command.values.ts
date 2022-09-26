import { GitCommand } from "./command.types";

export const checkoutCmd: GitCommand = {
  command: "checkout",
};

export const createAndCheckoutCmd: GitCommand = {
  command: "checkout -b",
};

export const statusCmd: GitCommand = {
  command: "status",
};

export const getRemoteOriginCmd: GitCommand = {
  command: "remote get-url",
  argument: "origin",
};

export const getCurrentBranch: GitCommand = {
  command: "rev-parse --abbrev-ref HEAD",
};

export const getLocalBranches: GitCommand = {
  command: "branch --format='%(refname:short)'",
  windowsCommand: "git branch --format=%(refname:short)",
};

export const getRemoteBranches: GitCommand = {
  command: "branch -r",
};
