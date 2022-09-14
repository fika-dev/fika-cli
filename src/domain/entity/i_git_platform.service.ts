import { GitStatus } from "../service/git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { VersionTag } from "../value_object/version_tag.vo";
import { Issue } from "./issue.entity";

// it should be replaced by importing
export interface IssueWithPR {
  issueNumber: number;
  prNumber: number;
}

export interface IGitPlatformService {
  createIssue(issue: Issue): Promise<Issue>;
  createPR(issue: Issue, branchName: string, baseBranch?: string): Promise<Issue>;
  configGitPlatform(config: AddOnConfig);
  pushBranch(branchName: string): Promise<void>;
  getBranchName(): Promise<string>;
  getGitRepoUrl(): Promise<string>;
  getLatestTag(): Promise<VersionTag>;
  fetchFromRemote(): Promise<void>;
  findDifferenceFromMaster(branchName: string, issueBranchPattern: string): Promise<IssueWithPR[]>;
  getLatestCommitId(branchName: string): Promise<string>;
  checkoutToBranchWithReset(branchName: string): Promise<void>;
  checkoutToBranchWithoutReset(branchName: string): Promise<void>;
  checkoutToFeatureBranch(branchName: string): Promise<void>;
  stageAllChanges(): Promise<void>;
  createDummyChange(): Promise<void>;
  commitWithMessage(message: string): Promise<void>;
  deleteLocalBranch(branchName: string): Promise<void>;
  deleteRemoteBranch(branchName: string): Promise<void>;
  tagCommit(branchName: string, tag: VersionTag): Promise<void>;
  getBranches(): Promise<string[]>;
  getLatestBranchByCommitDate(): Promise<string>;
  pullFrom(branchName: string): Promise<GitStatus>;
  checkUnstagedChanges(): Promise<boolean>;
  stash(id: string): Promise<void>;
  applyStash(id: string): Promise<void>;
  checkConflict(): Promise<boolean>;
  abortMerge(): Promise<void>;
  getSortedBranchesByCommitDate(): Promise<string[]>;
  gitInit(): Promise<void>;
  isThereRemoteUrl(): Promise<boolean>;
  removeRemoteUrl(): Promise<void>;
  setRemoteUrl(remoteUrl: string): Promise<void>;
  isGitRepo(): boolean;
  checkHeadExist(): Promise<boolean>;
  getUpstreamBranch(branchName: string): Promise<string>;
  pushBranchWithUpstream(branchName: string): Promise<void>;
}
