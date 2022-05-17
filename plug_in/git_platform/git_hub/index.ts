import { AddOnType } from "src/domain/entity/add_on.entity";
import { GitPlatform } from "src/domain/entity/git_platform.entity";
import { Issue } from "src/domain/entity/issue.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";
import {promisify} from 'util';
import { exec } from 'child_process';
import { COMMAND_NOT_FOUND_STRING, NoGithubCli} from 'src/domain/value_object/exceptions/no_gh_cli';

export class GitHub extends GitPlatform{
  
  constructor(config: AddOnConfig){
    super(config);
    this.addonType = AddOnType.GitPlatform;
  }
  
  async createIssue(issue: Issue): Promise<Issue> {
    const execP =promisify(exec);  
    const labelOptions = issue.labels.map((label)=>`--label "${label}" `).join(' ')
    const {stdout, stderr} = await execP(`gh issue create  --title "${issue.title}" --body "${issue.body}" ${labelOptions}`);
    if (stderr){
      if (stderr.includes(COMMAND_NOT_FOUND_STRING)){
        throw new NoGithubCli('NO_GH_CLI');
      }
    }
    const updatedIssue: Issue = {
      ...issue,
      issueUrl: stdout.trim(),
    };
    return updatedIssue;
  }

  async createPR(issue: Issue): Promise<Issue> {
    const execP =promisify(exec);  
    const labelOptions = issue.labels.map((label)=>`--label "${label}" `).join(' ')
    const {stdout: branchName, stderr: branchNameErr} = await execP('git rev-parse --abbrev-ref HEAD');
    const {stdout: pushOut, stderr: pushErr} =await execP(`git push origin ${branchName}`);
    const {stdout, stderr} = await execP(`gh pr create  --title "${issue.title}" --body "${issue.body}" ${labelOptions} --base develop`);
    const updatedIssue: Issue = {
      ...issue,
      prUrl: stdout.trim(),
    };
    return updatedIssue;
  }
}