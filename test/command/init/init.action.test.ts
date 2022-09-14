import { initAction } from "@/command/init/init.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import promptly from "promptly";
import { clearLocalConfig, clearTestFikaPath, readLocalConfig } from "test/test-utils";
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

test('1. test prompt askremoteUrl', async () => { 
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  await gitPlatformService.removeRemoteUrl();
  let correctMessage: string;
  const spy = jest.spyOn(promptly, 'prompt').mockImplementation(async (data) => {
    if (data.includes("remote")) {
      correctMessage = 'https://lavieen.rose';
      return 'https://lavieen.rose';
    } else {
      return;
    };
  })
  const remoteUrl = await promptService.askRemoteUrl();
  await gitPlatformService.setRemoteUrl(remoteUrl);
  expect(spy).toBeCalled();
  expect(correctMessage).toEqual('https://lavieen.rose');
  await gitPlatformService.removeRemoteUrl();
  await gitPlatformService.setRemoteUrl('https://github.com/fika-dev/fika-cli-test-samples.git');
});

test('2. get main, develop and release branch after initialiase', async () => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  await gitPlatformService.removeRemoteUrl();
  const gitInitSpy = jest.spyOn(gitPlatformService, 'gitInit');
  const commitSpy =  jest.spyOn(gitPlatformService, 'commitWithMessage').mockImplementation();
  const pushSpy =  jest.spyOn(gitPlatformService, 'pushBranchWithUpstream').mockImplementation();
  jest.spyOn(promptly, 'prompt').mockImplementation(async (data) => {
    if (data.includes("develop")) {
      return 'test_develop'
    } else if (data.includes("release")) {
      return 'test_release'
    } else if (data.includes("master")) {
      return 'test_master'
    } else if (data.includes("remote origin")) {
       return 'https://github.com/fika-dev/fika-cli-test-samples.git'
    } else {
      return;
    }
  });
  await initAction();
  const branchArr = await gitPlatformService.getBranches();
  expect(gitInitSpy).not.toBeCalled();
  expect(commitSpy).toBeCalled();
  expect(pushSpy).toBeCalled();
  expect(branchArr).toContain('test_develop');
  expect(branchArr).toContain('test_release');
  expect(branchArr).toContain('test_master');
  const currentBranch = await gitPlatformService.getBranchName();
  expect(currentBranch).toEqual('test_develop');
});

test('3. test prompt askBranchName', async () => { 
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

test('4. get local config before create', async () => { 
  clearLocalConfig(process.env.TESTING_REPO_PATH);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const config = configService.getLocalConfig();
  expect(config.branchNames.develop).toBe('develop');
});

test('5. create local config file', async () => { 
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  configService.createLocalConfig({ branchNames: { ...defaultLocalConfig.branchNames } });
  const config = readLocalConfig(process.env.TESTING_REPO_PATH);
  expect(config.branchNames.develop).toBe(defaultLocalConfig.branchNames.develop);
});

test('6. get local config after creation', async () => { 
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  configService.createLocalConfig({branchNames: {
    develop: 'dev',
    main: 'master',
    release: 'release',
  }});
  const config = configService.getLocalConfig();
  expect(config.branchNames.develop).toBe('dev');
});

test('7. test isThereRemoteUrl return false', async () => { 
  //const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  await gitPlatformService.removeRemoteUrl();
  const remoteUrl = await gitPlatformService.isThereRemoteUrl();
  expect(remoteUrl).toEqual(false);
  await gitPlatformService.setRemoteUrl('https://github.com/fika-dev/fika-cli-test-samples.git');
});

test('8. test isThereRemoteUrl return true', async () => { 
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const remoteUrl = await gitPlatformService.isThereRemoteUrl();
  expect(remoteUrl).toEqual(true);
  });

