import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { CONFIG_FILE_NAME, FIKA_PATH, LOCAL_CONFIG_NAME, SNAPSHOT_FILE_NAME } from "@/config/constants/path";
import container from "@/config/ioc_config";
import { Config } from "@/domain/entity/config.entity";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { SyncedSnapshot } from "@/domain/entity/synced_snapshot.entity";
import { IConfigService, LocalConfig } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import { exec } from 'child_process';
import fs from "fs";
import path from "path";
import { TEST_USER_CONFIG } from "test/test-constants";
import { promisify } from 'util';

export const clearTestFikaPath = (currentPath: string)=>{
  const fikaPath = currentPath + '/.fika';
  if (fs.existsSync(fikaPath))
  fs.rmSync(fikaPath, {
    recursive: true,
  });
}

export const clearLocalConfig = (currentPath: string) => {
  const fikaPath = path.join(currentPath, LOCAL_CONFIG_NAME);
  if (fs.existsSync(fikaPath)) {
    fs.rmSync(fikaPath, {
      recursive: true,
    });
    const isExist = fs.existsSync(fikaPath);
  }
}

export const createTestConfig = (fikaPath: string)=> {
  if (!fs.existsSync(fikaPath)) {
    fs.mkdirSync(fikaPath);
  }
  const fikaConfigFilePath = path.join(fikaPath, CONFIG_FILE_NAME);
  const configString = JSON.stringify(TEST_USER_CONFIG, undefined, 4);
  fs.writeFileSync(fikaConfigFilePath, configString);
}

export const setAuthToken = ()=> {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const token = configService.getFikaToken();
  const connectionService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  connectionService.useToken(token);
}

export const setUseToken = (token)=> {
  const connectionService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  connectionService.useToken(token);
}



export const readTestFikaConfig = (currentPath: string): Config=>{
  const fikaConfigFilePath = currentPath + '/.fika/fika.config.json';
  if (fikaConfigFilePath){
    const configString = fs.readFileSync(fikaConfigFilePath, 'utf-8');
    const config = JSON.parse(configString) as Config;
    return config;
  }else{
    throw new Error("Fika config file path is not set");
  }
}

export const readLocalConfig = (currentPath: string): LocalConfig=>{
  const fikaConfigFilePath = path.join(currentPath, LOCAL_CONFIG_NAME);
  if (fikaConfigFilePath){
    const configString = fs.readFileSync(fikaConfigFilePath, 'utf-8');
    const config = JSON.parse(configString) as LocalConfig;
    return config;
  }else{
    throw new Error("Fika config file path is not set");
  }
}

export const readTestSnapshot = (currentPath: string): SyncedSnapshot=>{
  const fikaSnapshotFilePath = path.join(currentPath, FIKA_PATH, SNAPSHOT_FILE_NAME );
  if (fikaSnapshotFilePath){
    const snapshotString = fs.readFileSync(fikaSnapshotFilePath, 'utf-8');
    const snapshot = JSON.parse(snapshotString) as SyncedSnapshot;
    return snapshot;
  }else{
    throw new Error("Fika snapshot file path is not set");
  }
}

export const restoreGitRepo = async (repoPath: string) =>{
  const execP =promisify(exec);
  const {stdout, stderr} = await execP(`git restore . && git clean -f`, { cwd: repoPath });
}

export const checkAndCloneRepo = async () =>{
  const isExist = await _checkTestingRepo(process.env.TESTING_REPO_PATH);
  if (!isExist){
    await _cloneTestingRepo(process.env.TESTING_PATH);
  }
}

const _cloneTestingRepo = async (repoParentPath: string) =>{
  const execP =promisify(exec);
  const {stdout, stderr} = await execP(`cd ${repoParentPath} && git clone ${process.env.TESTING_REPO_GIT_URL}`);
}

const _checkTestingRepo = async (repoPath: string): Promise<boolean> =>{
  try{
    const execP =promisify(exec);
    const { stdout: gitRepoUrlWithGit, stderr: branchNameErr } = await execP(
      `cd ${repoPath} && git remote get-url origin`
    );
    const remoteUrl = gitRepoUrlWithGit.trim();
    if (remoteUrl.includes("fika-cli-test-samples")){
      return true;
    }else{
      console.log('🧪', ' in Index: ', 'remoteUrl: ',remoteUrl);
      return false;
    }
  }catch(e){
    return false;
  }
}

export const checkOutToBranch = async (branchName: string)=> {
  const gitService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitService.checkoutToBranchWithReset(branchName);
}

export const deleteBranch = async (branchName: string)=> {
  const gitService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitService.deleteRemoteBranch(branchName);
}

export const deleteLocalBranch = async (branchName: string)=> {
  const gitService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitService.deleteRemoteBranch(branchName);
}


export const checkAndDeleteIssue = async (documentUrl: string)=> {
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const urlWithoutGit = process.env.TESTING_REPO_GIT_URL.replace('.git', '');
  const issue = await connectService.getIssueRecordByPage(new NotionUrl(documentUrl), urlWithoutGit);
  if (issue){
    await connectService.deleteIssue(urlWithoutGit, Issue.parseNumberFromUrl(issue.issueUrl));
  }
}

export const stageAndCommit = async (message: string)=> {
  const gitService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitService.stageAllChanges();
  await gitService.commitWithMessage(message);
}

export const makeMeaninglessChange = (filePath: string)=> {
  fs.appendFileSync(filePath, '\n');
}

export const sendPromptData = (line: string, delay = 0)=> {
  if (!delay) {
      setImmediate(() => process.stdin.emit('data', `${line}\n`));
  } else {
      setTimeout(() => process.stdin.emit('data', `${line}\n`), delay);
  }
}
