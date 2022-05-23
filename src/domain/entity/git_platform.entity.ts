import { AddOn } from "./add_on.entity";
import { DevObject } from "./dev_object.entity";
import { Issue } from "./issue.entity";
import { Morpher } from "./morpher.entity";

export abstract class GitPlatform extends AddOn{
  abstract createIssue(issue: Issue): Promise<Issue>;
  abstract createPR(issue: Issue, branchName: string): Promise<Issue>;
}