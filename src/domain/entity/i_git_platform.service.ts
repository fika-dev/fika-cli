import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Issue } from "./issue.entity";

export interface IGitPlatformService {
  createIssue(issue: Issue): Promise<Issue>
  createPR(issue: Issue): Promise<Issue>
  configGitPlatform(config: AddOnConfig)
}