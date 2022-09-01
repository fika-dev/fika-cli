import { Issue } from "../issue.entity";
import { AddOn } from "./add_on.entity";

export abstract class GitPlatform extends AddOn {
  abstract createIssue(issue: Issue): Promise<Issue>;
  abstract createPR(issue: Issue, branchName: string, baseBranchName: string): Promise<Issue>;
}
