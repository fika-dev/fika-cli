import { Issue } from "../issue.entity";
import { AddOn } from "./add_on.entity";

export interface GitPlatform {
  createIssue(issue: Issue): Promise<Issue>;
  createPR(issue: Issue, branchName: string, baseBranchName: string): Promise<Issue>;
}
