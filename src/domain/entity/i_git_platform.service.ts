import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Issue } from "./issue.entity";

export interface IGitPlatformService {
  createIssue(issue: Issue): Promise<Issue>
  createPR(issue: Issue, branchName: string, baseBranch?: string): Promise<Issue>
  configGitPlatform(config: AddOnConfig)
  pushBranch(branchName: string): Promise<void>
  getBranchName(): Promise<string>
  getGitRepoUrl(): Promise<string>
}