import { AddOnType } from "src/domain/entity/add_on.entity";
import { GitPlatform } from "src/domain/entity/git_platform.entity";
import { Issue } from "src/domain/entity/issue.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";
import {promisify} from 'util';
import { exec } from 'child_process';
import { COMMAND_NOT_FOUND_STRING, NoGithubCli} from '@/domain/value_object/exceptions/no_gh_cli';
import { GHCliNotLoggedin, NEED_LOGIN_STRING } from "@/domain/value_object/exceptions/gh_cli_not_loggedin";
import { GhPrAlreadyExists, PR_ALREADY_EXISTS_STRING, PR_FOR_BRANCH_STRING } from "@/domain/value_object/exceptions/gh_pr_already_exists";
import { GhNoCommits, NO_COMMITS_STRING } from "@/domain/value_object/exceptions/gh_no_commits";

export class GitHub extends GitPlatform{
  
  constructor(config: AddOnConfig){
    super(config);
    this.addonType = AddOnType.GitPlatform;
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
      }
    }
  }

  async createPR(issue: Issue, branchName: string): Promise<Issue> {
    const execP =promisify(exec);  
    const labelOptions = issue.labels.join(' ')
    try{
      const {stdout, stderr} = await execP(`gh pr create --base develop  --title "${issue.title}" --body "${issue.body}\n 해결이슈: #${this._parseIssueNumber(branchName)}" --label "${labelOptions}" `);
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

  _parseIssueNumber(branchName: string): string{
    const fragments = branchName.split('/');
    const featureName = fragments[fragments.length-1];
    const featureFragments = featureName.split('-');
    return featureFragments[featureFragments.length-1];
  }
}