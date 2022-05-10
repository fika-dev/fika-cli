import { AddOnType } from "src/domain/entity/add_on.entity";
import { GitPlatform } from "src/domain/entity/git_platform.entity";
import { Issue } from "src/domain/entity/issue.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";

export class GitHub extends GitPlatform{
  constructor(config: AddOnConfig){
    super(config);
    this.addonType = AddOnType.GitPlatform;
  }
  createIssue(issue: Issue): Promise<Issue> {
    throw new Error("Method not implemented.");
  }
}