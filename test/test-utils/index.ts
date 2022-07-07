import fs from "fs"
import path from "path";
import { CONFIG_FILE_NAME, FIKA_PATH, SNAPSHOT_FILE_NAME } from "@/config/constants/path";
import { Config } from "@/domain/entity/config.entity";
import { SyncedSnapshot } from "@/domain/entity/synced_snapshot.entity";
import {promisify} from 'util';
import { exec } from 'child_process';
import { testUserConfig } from "test/test-constants";
import container from "@/config/ioc_config";
import { IConnectService } from "@/domain/service/i_connect.service";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { IConfigService } from "@/domain/service/i_config.service";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";

export const clearTestFikaPath = (currentPath: string)=>{
  const fikaPath = currentPath + '/.fika';
  if (fs.existsSync(fikaPath))
  fs.rmSync(fikaPath, {
    recursive: true,
  });
}

export const createTestConfig = (fikaPath: string)=> {
  if (!fs.existsSync(fikaPath)) {
    fs.mkdirSync(fikaPath);
  }
  const fikaConfigFilePath = path.join(fikaPath, CONFIG_FILE_NAME);
  const configString = JSON.stringify(testUserConfig, undefined, 4);
  fs.writeFileSync(fikaConfigFilePath, configString);
}

export const setAuthToken = ()=> {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const token = configService.getFikaToken();
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
  const {stdout, stderr} = await execP(`cd ${repoPath} && git restore . && git clean -f`);
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
    if (remoteUrl === process.env.TESTING_REPO_GIT_URL){
      return true;
    }else{
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

export const stageAndCommit = async (message: string)=> {
  const gitService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitService.stageAllChanges();
  await gitService.commitWithMessage(message);
}

export const makeMeaninglessChange = (filePath: string)=> {
  fs.appendFileSync(filePath, '\n');
}