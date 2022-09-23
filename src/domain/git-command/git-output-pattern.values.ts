import {
  GitErrorPattern,
  GitNormalPattern,
  GitOutputPattern,
} from "@/domain/context/git-context/git-context.types";

const untackedFilesPattern: GitOutputPattern = {
  key: {
    domain: "git",
    field: "untrackedFiles",
  },
  value: true,
  pattern: "Untracked files",
};
const stagedFilesPattern: GitNormalPattern = "Changes to be committed";
const unstagedChangesPattern: GitNormalPattern = "Changes not staged for commit";
const remoteBranchNotFoundPattern: GitNormalPattern = "fatal: bad sha1 reference";
const localBranchNotFoundPattern: GitErrorPattern = "fatal: no such branch";
const noHeadPattern: GitErrorPattern = "No commits yet";
const notGitRepositoryPattern: GitErrorPattern = "fatal: not a git repository";
const upToDatePattern: GitErrorPattern = "Already up to date";
const mergeConflictPattern: GitErrorPattern = "Merge conflict";
const noRemoteBranchToPullPattern: GitErrorPattern = "couldn't find remote ref";
