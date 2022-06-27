import { IConfigService } from "@/domain/service/i_config.service";
import { GHCliNotLoggedin, NEED_LOGIN_STRING } from "@/domain/value_object/exceptions/gh_cli_not_loggedin";
import { GhNoCommits, NO_COMMITS_STRING } from "@/domain/value_object/exceptions/gh_no_commits";
import { GhPrAlreadyExists, PR_ALREADY_EXISTS_STRING, PR_FOR_BRANCH_STRING } from "@/domain/value_object/exceptions/gh_pr_already_exists";
import { COMMAND_NOT_FOUND_STRING, NoGithubCli } from '@/domain/value_object/exceptions/no_gh_cli';
import { NoGitRemote, NO_GIT_REMOTE_MESSAGE, NO_GIT_REMOTE_STRING } from "@/domain/value_object/exceptions/no_git_remote.vo";
import { exec } from 'child_process';
import { AddOnType } from "src/domain/entity/add_on.entity";
import { GitPlatform } from "src/domain/entity/git_platform.entity";
import { Issue } from "src/domain/entity/issue.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";
import { promisify } from 'util';

export class GitHub extends GitPlatform{
  private configService: IConfigService;
  
  constructor(config: AddOnConfig, configService: IConfigService){
    super(config);
    this.addonType = AddOnType.GitPlatform;
    this.configService = configService;
  }
  
  async createIssue(issue: Issue): Promise<Issue> {
    try{
      const execP =promisify(exec);  
    const labelOptions = issue.labels.map((label)=>`--label "${label}" `).join(' ')
    const {stdout} = await execP(`gh issue create  --title "${issue.title}" --body "${issue.body}" ${labelOptions}`);
    const updatedIssue: Issue = {
      ...issue,
      issueUrl: stdout.trim(),
    };
    return updatedIssue;
    } catch(e){
      if (e.stderr){
        if (e.stderr.includes(COMMAND_NOT_FOUND_STRING)){
          throw new NoGithubCli('NO_GH_CLI');
        }
        if (e.stderr.includes(NEED_LOGIN_STRING)){
          throw new GHCliNotLoggedin('GH_CLI_NOT_LOGGEDIN');
        }
        if (e.stderr.includes(NO_GIT_REMOTE_STRING)){
          throw new NoGitRemote(NO_GIT_REMOTE_MESSAGE);
        }
        throw e;
      }
    }
  }

  async createPR(issue: Issue, branchName: string, baseBranchName: string): Promise<Issue> {
    const execP =promisify(exec);  
    const labelOptions = issue.labels.join(' ')
    const issueNumber = this.configService.parseIssueNumber(branchName);
    try{
      const {stdout, stderr} = await execP(`gh pr create --base ${baseBranchName}  --title "${issue.title}" --body "Notion 다큐먼트: ${issue.notionUrl}\n 해결이슈: #${issueNumber}" --label "${labelOptions}" `);
      const updatedIssue: Issue = {
        ...issue,
        prUrl: stdout.trim(),
      };
      return updatedIssue;
    }catch(e){
      if (e.stderr){
        if (e.stderr.includes(COMMAND_NOT_FOUND_STRING)){
          throw new NoGithubCli('NO_GH_CLI');
        }
        if (e.stderr.includes(NEED_LOGIN_STRING)){
          throw new GHCliNotLoggedin('GH_CLI_NOT_LOGGEDIN');
        }
        if (e.stderr.includes(PR_ALREADY_EXISTS_STRING) && e.stderr.includes(PR_FOR_BRANCH_STRING)){
          throw new GhPrAlreadyExists('GhPrAlreadyExists');
        }
        if (e.stderr.includes(NO_COMMITS_STRING)){
          throw new GhNoCommits('GhNoCommits');
        }
      }
    }
  }


}