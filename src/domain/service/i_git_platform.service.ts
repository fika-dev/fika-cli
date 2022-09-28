import { GitStatus } from "./git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { VersionTag } from "../value_object/version_tag.vo";
import { Issue } from "../entity/issue.entity";

// it should be replaced by importing
export interface IssueWithPR {
  issueNumber: number;
  prNumber: number;
}

export interface IGitPlatformService {
  createIssue(issue: Issue): Promise<Issue>; // not Cmd
  createPR(issue: Issue, branchName: string, baseBranch?: string): Promise<Issue>; // not cmd
  configGitPlatform(config: AddOnConfig); // not Cmd
  pushBranch(branchName: string): Promise<void>; // need two arguments origin and branchName
  getBranchName(): Promise<string>; // redundant
  getGitRepoUrl(): Promise<string>; // need one argument and post treatment
  getLatestTag(): Promise<VersionTag>; // need to adapt the implementation
  fetchFromRemote(): Promise<void>; // ok
  findDifferenceFromMaster(branchName: string, issueBranchPattern: string): Promise<IssueWithPR[]>; // not a cmd
  getLatestCommitId(branchName: string): Promise<string>; // not a cmd
  checkoutToBranchWithReset(branchName: string): Promise<void>; // not a Cmd
  checkoutToBranchWithoutReset(branchName: string): Promise<void>; // not a Cmd
  checkoutToFeatureBranch(branchName: string): Promise<void>; // not a Cmd
  stageAllChanges(): Promise<void>; // ok
  createDummyChange(): Promise<void>; // not a Cmd
  commitWithMessage(message: string): Promise<void>; // need one argument and post treatment
  deleteLocalBranch(branchName: string): Promise<void>; // need one argument
  deleteRemoteBranch(branchName: string): Promise<void>; // not a cmd
  tagCommit(branchName: string, tag: VersionTag): Promise<void>; // need ~3 arguments
  getBranches(): Promise<string[]>; // post-treatment needed
  getLatestBranchByCommitDate(): Promise<string>; // not Cmd
  pullFrom(branchName: string): Promise<GitStatus>; // need one argument
  checkUnstagedChanges(): Promise<boolean>; // post-treatment needed
  stash(id: string): Promise<void>; // need one argument
  applyStash(id: string): Promise<void>; // need one argument
  checkConflict(): Promise<boolean>; // redundant
  abortMerge(): Promise<void>; // ok
  getSortedBranchesByCommitDate(): Promise<string[]>; // post treatment needed
  gitInit(): Promise<void>; // ok
  isThereRemoteUrl(): Promise<boolean>; // need one argument and post treatment needed
  removeRemoteUrl(): Promise<void>; // need one argument
  setRemoteUrl(remoteUrl: string): Promise<void>;
  isGitRepo(): boolean; // not a cmd
  checkHeadExist(): Promise<boolean>; // redundant
  getUpstreamBranch(branchName: string): Promise<string>; // redundant ??
  pushBranchWithUpstream(branchName: string): Promise<void>; // redundant
  checkRemoteBranchExist(branchName: string): Promise<boolean>; // need one argument and post treatment
  undoCommitAndModification(): Promise<void>; // ok
}
