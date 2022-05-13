import { AddOnType } from "src/domain/entity/add_on.entity";
import { GitPlatform } from "src/domain/entity/git_platform.entity";
import { Issue } from "src/domain/entity/issue.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";
import {promisify} from 'util';
import { exec } from 'child_process';

export class GitHub extends GitPlatform{
  
  constructor(config: AddOnConfig){
    super(config);
    this.addonType = AddOnType.GitPlatform;
  }
  
  async createIssue(issue: Issue): Promise<Issue> {
    const execP =promisify(exec);  
    const labelOptions = issue.labels.map((label)=>`--label "${label}" `).join(' ')
    const {stdout, stderr} = await execP(`gh issue create  --title "${issue.title}" --body "${issue.body}" ${labelOptions}`);
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