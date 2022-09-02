import { initAction } from "@/command/init/init.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { clearLocalConfig, clearTestFikaPath, readLocalConfig, sendPromptData } from "test/test-utils";
import promptly from "promptly";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { GitPlatformService } from "@/domain/service/git_platform.service";
import { exec } from "child_process";
import { promisify } from "util";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
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
  //await gitPlatformService.deleteLocalBranch('test_develop');
  //await gitPlatformService.deleteLocalBranch('test_master');
  //await gitPlatformService.deleteLocalBranch('test_release');
});

test('1.test commitWithMessage when there is something to commit', async () => { 
     const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
     );
    const errorService = container.get<IErrorHandlingService>(
    SERVICE_IDENTIFIER.ErrorHandlingService
    );
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  
    const spyS = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    const spyW = jest.spyOn(messageService, 'showWarning').mockImplementation( () => {});
    const spyE = jest.spyOn(messageService, 'showError').mockImplementation( () => {});
    //try {
    await gitPlatformService.createDummyChange();
    await gitPlatformService.stageAllChanges();
    const remoteUrl = await gitPlatformService.commitWithMessage('this is a test commit with specialkeyword');      
    // } catch (e) {
    //     errorService.handle(e);
    // }
    expect(spyS).not.toBeCalledWith(' ');
    expect(spyW).not.toBeCalledWith(' ');
    expect(spyE).not.toBeCalledWith(' ');
});

test('2.test commitWithMessage when there is nothing to commit', async () => { 
     const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
     );
    const errorService = container.get<IErrorHandlingService>(
    SERVICE_IDENTIFIER.ErrorHandlingService
    );
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
    const spy = jest.spyOn(messageService, 'showError').mockImplementation((e) => e.message);
    try {
        const remoteUrl = await gitPlatformService.commitWithMessage('this is a test commit with specialkeyword');
        expect(spy).toBeCalledWith('There is nothing to commit');
        } catch (e) {
        errorService.handle(e);
    }
});

test('3. test isThereRemoteUrl return true', async () => { 
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const remoteUrl = await gitPlatformService.isThereRemoteUrl();
  expect(remoteUrl).toEqual(true);
  });