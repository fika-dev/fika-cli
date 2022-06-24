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
  createPR(
    issue: Issue,
    branchName: string,
    baseBranch?: string
  ): Promise<Issue>;
  configGitPlatform(config: AddOnConfig);
  pushBranch(branchName: string): Promise<void>;
  getBranchName(): Promise<string>;
  getGitRepoUrl(): Promise<string>;
  getLatestTag(): Promise<VersionTag>;
  fetchFromRemote(): Promise<void>;
  findDifferenceFromMaster(
    branchName: string,
    issueBranchPattern: string
  ): Promise<IssueWithPR[]>;
  getLatestCommitId(branchName: string): Promise<string>;
  checkoutToBranch(branchName: string): Promise<void>;
  tagCommit(branchName: string, tag: VersionTag): Promise<void>;
}
