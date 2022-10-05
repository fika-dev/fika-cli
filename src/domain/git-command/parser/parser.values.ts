import { OutputPatterns } from "./parser.type";

export const headPattern = "No commit";
export const unstagedChangePattern = "Changes not staged for commit";
export const untrackedFilesPattern = "Untracked files:";
export const stagedChangesPattern = "Changes to be committed:";
export const noRemote = "error: No such remote";
export const noHeadDefined = "fatal: ambiguous argument 'HEAD'";
export const mergeConflictStatusPattern = "git merge --abort";
export const commandNotFound = "command not found";
export const existingGitVersion = "git version";
export const existingGhVersion = "gh version";
export const errorPattern = "error";
export const fatalPattern = "fatal";
export const pullOutputPatterns: OutputPatterns = [
  {
    pattern: "Already up to date.",
    value: "NO_CHANGE",
  },
  {
    pattern: "Fast-forward",
    value: "FF_UPDATED",
  },
  {
    pattern: "Merge conflict",
    value: "CONFLICT",
  },
  {
    pattern: "couldn't find remote ref",
    value: "NO_REMOTE",
  },
  {
    pattern: "Merge made",
    value: "MERGED",
  },
];
