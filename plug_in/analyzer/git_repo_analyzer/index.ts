import { Analyzer } from "src/domain/entity/analyzer.entity";
import { DevObject } from "src/domain/entity/dev_object.entity";
import { Morpher } from "src/domain/entity/morpher.entity";
import {promisify} from 'util';
import { exec } from 'child_process';
import { Repo } from "src/domain/entity/repo.entity";

export class GitRepoAnalyzer extends Analyzer{
  async analyze(morpher: Morpher): Promise<DevObject[]> {
    const repo = await this.analyzeRepo();
    return [repo];
  }

  protected async analyzeRepo(): Promise<Repo>{
    try{
      let repo: Repo = Repo.getEmptyRepo();
      const execP =promisify(exec);
      const tty = process.platform === 'win32' ? 'CON' : '/dev/tty';
      const {stdout, stderr} = await execP('git remote | head -n 1');
      if (!stderr){
        const remoteName = stdout.trim();
        const {stdout: remoteUrl} = await execP(`git remote get-url ${remoteName}`);
        repo.repoUrl = remoteUrl.trim();
        const {stdout: repoName} = await execP(`echo ${repo.repoUrl}| rev | cut -d'/' -f 1 | rev | cut -d'.' -f 1`);
        repo.title = repoName.trim();
        const {stdout: latestVersion} = await execP(`git tag --sort=committerdate -l`);
        if (latestVersion.length != 0){
          repo.latestVersion = latestVersion.trim();
        }
        const {stdout: authorsString} = await execP(`git shortlog -sne < ${tty} | awk '{$1=""; sub(" ", ""); print}' | awk -F'<' '!x[$1]++' | awk -F'<' '!x[$2]++'`);
        repo.authors = authorsString.split('\n').slice(0,-1)
        const {stdout: createdDate} = await execP(`git log --reverse  --pretty=format:"%ad" | head -n 1`);
        repo.createdDate = new Date(createdDate)
        const {stdout: commitCount} = await execP(`git log $MERGES_ARG --oneline $commit | wc -l | tr -d ' '`);
        repo.commitCount = parseInt(commitCount);
        const {stdout: activeDays} = await execP(`git log --pretty=format:"%ad" --date=format:'%Y-%m-%d' | uniq | wc -l`);
        repo.activeDays = parseInt(activeDays);
        const {stdout: fileCount} = await execP(`git ls-files | wc -l | tr -d ' '`);
        repo.fileCount = parseInt(fileCount);
        const {stdout: syncedCommitId} = await execP(`git rev-parse --short HEAD`);
        repo.syncedCommitId = syncedCommitId.trim();
        repo.lastSyncedDate = new Date(Date.now());
        console.log(repo)
      }else{
        console.log('🧪', ' in Repo: ', 'stderr: ',stderr);
      }
      console.log('🧪', ' in Repo: ', 'repo: ',repo);
      return repo;
    }catch(e){
      console.log('🧪', ' in Repo: ', 'e: ',e);
    }
  }

}



