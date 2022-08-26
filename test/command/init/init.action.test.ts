import { initAction } from "@/command/init/init.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { clearLocalConfig, clearTestFikaPath, readLocalConfig, sendPromptData } from "test/test-utils";
import promptly from "promptly";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { GitPlatformService } from "@/domain/service/git_platform.service";

const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
// jest.spyOn(process.stdout, 'write').mockImplementation(()=>true)

afterEach(()=>{
  jest.clearAllMocks();
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

beforeEach(()=>{
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});



beforeAll(() => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

afterAll(async () => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await gitPlatformService.deleteLocalBranch('test_develop');
  await gitPlatformService.deleteLocalBranch('test_master');
  await gitPlatformService.deleteLocalBranch('test_release');
});
test('0. get main, develop and release branch after initialiase', async () => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const gitInitSpy = jest.spyOn(gitPlatformService, 'gitInit');
  jest.spyOn(promptly, 'prompt').mockImplementation(async (data) => {
    if (data.includes("develop")) {
      return 'test_develop'
    } else if (data.includes("release")) {
      return 'test_release'
    } else if (data.includes("master")) {
      return 'test_master'
    } else {
      return;
    }
  });
  await initAction();
  const branchArr = await gitPlatformService.getBranches();
  expect(gitInitSpy).toBeCalled();
  expect(branchArr).toContain('test_develop');
  expect(branchArr).toContain('test_release');
  expect(branchArr).toContain('test_master');
  const currentBranch = await gitPlatformService.getBranchName();
  expect(currentBranch).toEqual('test_develop');
});

test('1. test prompt askBranchName', async () => { 
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const branchName = 'develop';
  let correctMessage: boolean;
  const spy = jest.spyOn(promptly, 'prompt').mockImplementation(async (data)=>{
    if(data.includes("Develop")){
      correctMessage = true;
    }else{
      correctMessage = false;
    }
    return branchName;
  })
  const devBranchName = await promptService.askBranchName("Develop", "develop", ["develop"]);
  expect(devBranchName).toBe(branchName);
  expect(spy).toBeCalled();
  expect(correctMessage).toEqual(true);
});

// test('2. test prompt askBranchName empty candidates', async () => { 
//   const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
//   const branchName = 'develop';
//   sendPromptData(branchName, 10);
//   const devBranchName = await promptService.askBranchName("name for develop branch", "develop", []);
//   expect(devBranchName).toBe(branchName);
//   expect(process.stdout.write).toHaveBeenCalledWith("name for develop branch: ");
// });

test('2. get local config before create', async () => { 
  clearLocalConfig(process.env.TESTING_REPO_PATH);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const config = configService.getLocalConfig();
  expect(config.branchNames.develop).toBe('develop');
});

test('3. create local config file', async () => { 
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  configService.createLocalConfig({ branchNames: { ...defaultLocalConfig.branchNames } });
  const config = readLocalConfig(process.env.TESTING_REPO_PATH);
  expect(config.branchNames.develop).toBe(defaultLocalConfig.branchNames.develop);
});

test('4. get local config after creation', async () => { 
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  configService.createLocalConfig({branchNames: {
    develop: 'dev',
    main: 'master',
    release: 'release',
  }});
  const config = configService.getLocalConfig();
  expect(config.branchNames.develop).toBe('dev');
});


