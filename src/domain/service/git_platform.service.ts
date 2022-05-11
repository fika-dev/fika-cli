import { injectable } from "inversify";
import { GitHub } from "plug_in/git_platform/git_hub";
import { AddOnType } from "../entity/add_on.entity";
import { GitPlatform } from "../entity/git_platform.entity";
import { Issue } from "../entity/issue.entity";
import { IGitPlatformService } from "../entity/i_git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";

@injectable()
export class GitPlatformService implements IGitPlatformService{
  private _gitPlatform: GitPlatform;

  async createIssue(issue: Issue): Promise<Issue> {
    if (this._gitPlatform){
      return await this._gitPlatform.createIssue(issue);
    }else{
      throw new Error("Git Platform is not defined, need to config first");
    }
  }
  configGitPlatform(config: AddOnConfig) {
    if (config.type === AddOnType.GitPlatform){
      if (config.name === 'Github.GitPlatform'){
        this._gitPlatform = new GitHub(config);
      }
    }
  }
}