import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { exec } from "child_process";
import { inject, injectable } from "inversify";
import { GitHub } from "plug_in/git_platform/git_hub";
import { promisify } from "util";
import { AddOnType } from "../entity/add_on.entity";
import { GitPlatform } from "../entity/git_platform.entity";
import { Issue } from "../entity/issue.entity";
import { IGitPlatformService } from "../entity/i_git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { ConfigService } from "./config.service";
import { IConfigService } from "./i_config.service";

@injectable()
export class GitPlatformService implements IGitPlatformService{
  private configService: IConfigService;
  constructor(@inject(SERVICE_IDENTIFIER.ConfigService) configService: IConfigService){
    this.configService = configService;
  }
  async getGitRepoUrl(): Promise<string> {
    const execP =promisify(exec);  
    const {stdout: gitRepoUrlWithGit, stderr: branchNameErr} = await execP('git remote get-url origin');
    return gitRepoUrlWithGit.replace('.git', '').trim();
  }

  async getBranchName(): Promise<string> {
    const execP =promisify(exec);  
    const {stdout: branchName, stderr: branchNameErr} = await execP('git rev-parse --abbrev-ref HEAD');
    return branchName;
  }

  async pushBranch(branchName: string): Promise<void> {
    const execP =promisify(exec);  
    const {stdout: pushOut, stderr: pushErr} =await execP(`git push origin ${branchName}`);
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

  async createPR(issue: Issue, branchName: string, baseBranch? : string): Promise<Issue> {
    if (this._gitPlatform){
      let baseBranchName: string;
      if (!baseBranch){
        baseBranchName = this.configService.getBaseBranch();
      }else{
        baseBranchName = baseBranch;
      }
      return await this._gitPlatform.createPR(issue, branchName, baseBranchName);
    }else{
      throw new Error("Git Platform is not defined, need to config first");
    }
  }
}