import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Issue } from "./issue.entity";

export interface IGitPlatformService {
  createIssue(issue: Issue): Issue
  configGitPlatform(config: AddOnConfig)
}