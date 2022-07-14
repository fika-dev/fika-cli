import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { initAction } from "src/command/init/init.action";
import { clearLocalConfig, clearTestFikaPath, readLocalConfig, readTestFikaConfig, sendPromptData } from "test/test-utils";
jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(jest.clearAllMocks);



beforeAll(() => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

afterAll(() => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

test('1. create config & check notion workspace', () => { 
  initAction(process.env.TESTING_PATH);
  const config = readTestFikaConfig(process.env.TESTING_PATH);
  expect(config.notionWorkspace).toBe("NOT_CONNECTED");
});

test('2. test prompt askBranchName', async () => { 
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const branchName = 'develop';
  sendPromptData(branchName);
  const devBranchName = await promptService.askBranchName("name for develop branch", "develop", ["develop"]);
  expect(devBranchName).toBe(branchName);  
  expect(process.stdout.write).toHaveBeenCalledWith("name for develop branch (already defined branches: develop): ");
});

test('3. create local config file', async () => { 
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  configService.createLocalConfig({branchNames: defaultLocalConfig.branchNames});
  const config = readLocalConfig(process.env.TESTING_REPO_PATH);
  console.log('🧪', ' in InitActionTest: ', 'config: ',config);
  expect(config.branchNames.develop).toBe(defaultLocalConfig.branchNames.develop);
});