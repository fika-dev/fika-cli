import { GitCommand, GitCommandWithArguments } from "./command.types";

// abortMerge(): Promise<void>;
export const abortMergeCmd: GitCommand = {
  command: "merge --abort",
};

// applyStash(id: string): Promise<void>;
// need one arg id
export const applyStashCmd: GitCommand = {
  command: "git stash apply stash^",
  windowsCommand: "git stash apply stash^^",
  requiredArgument: true,
};

export const checkoutCmd: GitCommand = {
  command: "checkout",
};

// checkRemoteBranchExist(branchName: string): Promise<boolean>;
// need one argument origin/branchName
export const checkRemoteBranchExistCmd: GitCommand = {
  command: "show-branch remotes/",
  requiredArgument: true,
};

// checkUnstagedChanges(): Promise<boolean>;
// post treatment needed :
// if (changes.trim().length > 0) { return true;  } else { return false; }
export const checkUnstagedChangesCmd: GitCommand = {
  command: "--no-pager diff --name-only",
};

export const createAndCheckoutCmd: GitCommand = {
  command: "checkout -b",
};

// commitWithMessage(message: string): Promise<void>;
// argument needed : commit message and post treatment :
// catch (e) {const message = e.stdout + e.stderr; if (message.includes("nothing to commit")) { throw new NothingToCommit("NothingToCommit");} else {throw e;}
export const commitWithMessageCmd: GitCommand = {
  command: "commit -m",
  requiredArgument: true,
};

// deleteLocalBranch(branchName: string): Promise<void>;
// one argument : branchName
export const deleteLocalBranchCmd: GitCommand = {
  command: "branch -D ",
  requiredArgument: true,
};

// fetchFromRemote(): Promise<void>;
export const fetchCmd: GitCommand = {
  command: "fetch",
};

// getBranches(): Promise<string[]>;
// post treatment needed :
//  return branchesText.split("\n").map(branch => branch.trim().replace("'", "").replace("'", ""));
export const getBranchesCmd: GitCommand = {
  command: "branch --format='%(refname:short)'",
  windowsCommand: "branch --format=%(refname:short)",
};

// Adding Cmd
export const getCurrentBranchCmd: GitCommand = {
  command: "rev-parse --abbrev-ref HEAD",
};

//async getGitRepoUrl(): Promise<string>
// need one argument origin and post-treatment needed :
// return gitRepoUrlWithGit.replace(".git", "").trim();
export const getGitRepoUrlCmd: GitCommand = {
  command: "remote get-url ",
  requiredArgument: true,
};

// getLatestTag(): Promise<VersionTag>
// need to catch the fatal error and send undefined
export const getLatestTagCmd: GitCommand = {
  command: "describe --tags $(git rev-list --tags --max-count=1)",
};

// Adding Cmd
export const getLocalBranchesCmd: GitCommand = {
  command: "branch --format='%(refname:short)'",
  windowsCommand: "git branch --format=%(refname:short)",
};

// Adding Cmd
export const getRemoteBranchesCmd: GitCommand = {
  command: "branch -r",
};

// need one argument origin
export const getRemoteOriginCmd: GitCommand = {
  command: "remote get-url",
  requiredArgument: true,
};

//getSortedBranchesByCommitDate(): Promise<string[]>;
// post treatment needed :
// return branchesText.trim().split("\n").map(branch => branch.trim());}
export const getSortedBranchesByCommitDateCmd: GitCommand = {
  command: "branch --sort=-committerdate --format='%(refname:short)'",
  windowsCommand: "branch --sort=-committerdate --format=%(refname:short)",
};

// getUpstreamBranch(branchName: string): Promise<string>;
// need one arg branchName
export const getUpstreamBranchCmd: GitCommand = {
  command: "rev-parse --abbrev-ref",
  requiredArgument: true,
};

// gitInit(): Promise<void>
export const gitInitCmd: GitCommand = {
  command: "init .",
};

// isGitRepo(): boolean; Not a git cmd

// isThereRemoteUrl(): Promise<boolean>
// need one argument origin and post treatment needed :
//  return remoteResp.trim().length > 0;} catch (e) {if (e.stderr.includes("No such remote")) {return false;} else {throw e;}
export const isThereRemoteUrlCmd: GitCommand = {
  command: "remote get-url ",
  requiredArgument: true,
};

//  pullFrom(branchName: string): Promise<GitStatus>;
// need one argument branchName and post treatment with catching errors
export const pullFromCmd: GitCommand = {
  command: "pull --no-ff origin ",
  requiredArgument: true,
};

// pushBranch(branchName: string): Promise<void>;
// need 2 arguments origin and BranchName
export const pushBranchCmd: GitCommand = {
  command: "push",
  requiredArgument: true,
};

// removeRemoteUrl(): Promise<void>;
// need one argument origin
export const removeRemotsUrlCmd: GitCommand = {
  command: "remote remove ",
  requiredArgument: true,
};

// stageAllChanges(): Promise<void>;
export const stageAllChangesCmd: GitCommand = {
  command: "add .",
};

//stash(id: string): Promise<void>;
//need one argument Id
export const stashCmd: GitCommand = {
  command: "stash push -u -m ",
};

export const statusCmd: GitCommand = {
  command: "status",
};

//  tagCommit(branchName: string, tag: VersionTag): Promise<void>;
// need ~3 arguments : ${tag.verionString} -m "${branchName} version ${tag.verionString}\ngenerated by fika
export const tagCommitCmd: GitCommand = {
  command: "tag -a",
  requiredArgument: true,
};

// undoCommitAndModification(): Promise<void>;
export const undoCommitAndModificationCmd: GitCommand = {
  command: "reset HEAD~ && git checkout -- .",
};
