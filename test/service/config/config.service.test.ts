import { defaultConfig, defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { LOCAL_CONFIG_NAME } from "@/config/constants/path";
import { getGitRepoPathCmd } from "@/domain/git-command/git-command.values";
import { IConfigService } from "@/domain/service/i_config.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import * as T from "fp-ts/Task";
import fs from "fs";
import path from "path";
import container from "src/config/ioc_config";
import { OLD_TEST_CONFIG, TEST_GIT_REPO_PATH, TEST_NOTION_WORKSPACE_ID, TEST_USER_CONFIG } from "test/test-constants";
import { spyWithMock } from "test/test-utils";

const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});


test('1. when there is old workspace', async () => {
  jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return OLD_TEST_CONFIG;
  });
  let fileContents
  const spy = jest.spyOn(fs, "writeFileSync").mockImplementation((_, data)=>{
    fileContents = data;
  });
  configService.readConfig();
  const workspaceId = configService.getWorkspaceId().asString();
  expect(fileContents).toContain('workspace');
  expect(fileContents).toContain(TEST_NOTION_WORKSPACE_ID);
  expect(fileContents).not.toContain('notionWorkspace');
  expect(workspaceId).toEqual(TEST_NOTION_WORKSPACE_ID);
});

test('2. when it is new workspace', async () => {
  jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return JSON.stringify(TEST_USER_CONFIG);
  });
  configService.readConfig();
  const workspaceId = configService.getWorkspaceId().asString();
  expect(workspaceId).toEqual(TEST_NOTION_WORKSPACE_ID);
});

test('3. when there was no config file', async () => {
  jest.spyOn(fs, "existsSync").mockImplementation((_)=>{
    return false;
  });
  jest.spyOn(fs, "mkdirSync").mockImplementation((_)=>{
    return undefined;  
  });
  jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return JSON.stringify(defaultConfig);
  });
  let errorName;
  let workspaceId;
  configService.readConfig();
  try{
    workspaceId = configService.getWorkspaceId();
  }catch(e){
    const exception = e as BaseException
    errorName = exception.name
  }
  expect(errorName).toEqual("WORKSPACE_NOT_CONNECTED");
  
});

test('4. git repo path', async () => {
  jest.resetAllMocks();
  spyWithMock((cmd)=>{
    if (cmd.command === getGitRepoPathCmd.command){
      return T.of(TEST_GIT_REPO_PATH);
    }
    throw Error("not implemented");;
  })
  jest.spyOn(fs, "existsSync").mockImplementation((_)=>{
    return true;
  });
  jest.spyOn(fs, "mkdirSync").mockImplementation((_)=>{
    return undefined;  
  });
  const spy = jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return JSON.stringify(defaultLocalConfig);
  });
  jest.spyOn(fs, "writeFileSync").mockImplementation((_, data)=>undefined);
  jest.spyOn(configService, "readConfig").mockImplementation(()=>defaultConfig);
  await configService.getLocalConfig();
  expect(spy).toBeCalledWith(path.join(TEST_GIT_REPO_PATH,LOCAL_CONFIG_NAME), "utf-8");
});


// test('5. create local config file', async () => {
//   const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
//   await configService.createLocalConfig({ branchNames: { ...defaultLocalConfig.branchNames } });
//   const config = readLocalConfig(process.env.TESTING_REPO_PATH);
//   expect(config.branchNames.develop).toBe(defaultLocalConfig.branchNames.develop);
// });

// test('6. get local config after creation', async () => { 
//   const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
//   await configService.createLocalConfig({branchNames: {
//     develop: 'dev',
//     main: 'master',
//     release: 'release',
//   }});
//   const config = await configService.getLocalConfig();
//   expect(config.branchNames.develop).toBe('dev');
// });
