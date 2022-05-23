import { exec } from "child_process";
import { injectable } from "inversify";
import { GitHub } from "plug_in/git_platform/git_hub";
import { promisify } from "util";
import { AddOnType } from "../entity/add_on.entity";
import { GitPlatform } from "../entity/git_platform.entity";
import { Issue } from "../entity/issue.entity";
import { IGitPlatformService } from "../entity/i_git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";

@injectable()
export class GitPlatformService implements IGitPlatformService{
  async pushCurrentBranch(): Promise<string> {
    const execP =promisify(exec);  
    const {stdout: branchName, stderr: branchNameErr} = await execP('git rev-parse --abbrev-ref HEAD');
    const {stdout: pushOut, stderr: pushErr} =await execP(`git push origin ${branchName}`);
    return branchName;
  }
  
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

  async createPR(issue: Issue, branchName: string): Promise<Issue> {
    if (this._gitPlatform){
      return await this._gitPlatform.createPR(issue, branchName);
    }else{
      throw new Error("Git Platform is not defined, need to config first");
    }
  }
}