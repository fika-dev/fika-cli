import { initAction } from "@/command/init/init.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import promptly from "promptly";
import { clearLocalConfig, clearTestFikaPath, restoreGitRepo } from "test/test-utils";
const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
// jest.spyOn(process.stdout, 'write').mockImplementation(()=>true)

afterEach(()=>{
  jest.clearAllMocks();
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

beforeEach(()=>{
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});



// beforeAll(() => {
//   clearTestFikaPath(process.env.TESTING_PATH);
//   clearLocalConfig(process.env.TESTING_REPO_PATH);
//   jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>undefined);
//   jest.spyOn(messageService, 'showError').mockImplementation(()=>undefined);
//   jest.spyOn(messageService, 'showWarning').mockImplementation(()=>undefined);
//   jest.spyOn(messageService, 'showWaiting').mockImplementation(()=>undefined);
//   jest.spyOn(messageService, 'endWaiting').mockImplementation(()=>undefined);

// });

// afterAll(async () => {
//   clearTestFikaPath(process.env.TESTING_PATH);
//   clearLocalConfig(process.env.TESTING_REPO_PATH);
//   await gitPlatformService.checkoutToBranchWithoutReset('develop');
//   await gitPlatformService.deleteLocalBranch('test_develop');
//   await gitPlatformService.deleteLocalBranch('test_master');
//   await gitPlatformService.deleteLocalBranch('test_release');
//   await restoreGitRepo(process.env.TESTING_REPO_PATH);
// });

test("", () => {
  
})

// test('1. test prompt askremoteUrl', async () => { 
//   const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
//   const gitPlatformService = container.get<IGitPlatformService>(
//     SERVICE_IDENTIFIER.GitPlatformService
//   );
//   // await gitPlatformService.removeRemoteUrl();
//   let correctMessage: string;
//   const spy = jest.spyOn(p, 'prompts').mockImplementation(async (_) => {
//     correctMessage = 'https://lavieen.rose';
//     return Promise.resolve('https://lavieen.rose');
//   })
//   const remoteUrl = await promptService.askRemoteUrl();
//   expect(spy).toBeCalled();
//   expect(remoteUrl).toEqual(correctMessage);
// });

// test('2. get main, develop and release branch after initialiase', async () => {
//   const gitPlatformService = container.get<IGitPlatformService>(
//     SERVICE_IDENTIFIER.GitPlatformService
//   );
//   await gitPlatformService.removeRemoteUrl();
//   const gitInitSpy = jest.spyOn(gitPlatformService, 'gitInit');
//   const stageSpy = jest.spyOn(gitPlatformService, 'stageAllChanges').mockImplementation(()=>undefined);
//   const commitSpy =  jest.spyOn(gitPlatformService, 'commitWithMessage').mockImplementation(()=>undefined);
//   const pushSpy =  jest.spyOn(gitPlatformService, 'pushBranchWithUpstream').mockImplementation(()=>undefined);
//   jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => defaultLocalConfig);
//   jest.spyOn(configService, 'createLocalConfig').mockImplementation(async () => undefined);
//   jest.spyOn(prompts, 'prompt').mockImplementation(async (data) => {
//     if (data.includes("develop")) {
//       return 'test_develop'
//     } else if (data.includes("release")) {
//       return 'test_release'
//     } else if (data.includes("master")) {
//       return 'test_master'
//     } else if (data.includes("remote origin")) {
//        return 'https://github.com/fika-dev/fika-cli-test-samples.git'
//     } else {
//       return;
//     }
//   });
//   await initAction();
//   const branchArr = await gitPlatformService.getBranches();
//   expect(gitInitSpy).not.toBeCalled();
//   expect(commitSpy).toBeCalled();
//   expect(pushSpy).toBeCalled();
//   expect(stageSpy).toBeCalled();
//   expect(branchArr).toContain('test_develop');
//   expect(branchArr).toContain('test_release');
//   expect(branchArr).toContain('test_master');
//   const currentBranch = await gitPlatformService.getBranchName();
//   expect(currentBranch).toEqual('test_develop');
//   commitSpy.mockRestore();
//   pushSpy.mockRestore();
// });

// test('3. test prompt askBranchName', async () => { 
//   const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
//   const branchName = 'develop';
//   let correctMessage: boolean;
//   const spy = jest.spyOn(promptly, 'prompt').mockImplementation(async (data)=>{
//     if(data.includes("Develop")){
//       correctMessage = true;
//     }else{
//       correctMessage = false;
//     }
//     return branchName;
//   })
//   const devBranchName = await promptService.askBranchName("Develop", "develop", ["develop"]);
//   expect(devBranchName).toBe(branchName);
//   expect(spy).toBeCalled();
//   expect(correctMessage).toEqual(true);
// });


// test('7. test isThereRemoteUrl return false', async () => { 
//   //const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
//   jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => defaultLocalConfig);
//   const gitPlatformService = container.get<IGitPlatformService>(
//     SERVICE_IDENTIFIER.GitPlatformService
//   );
//   await gitPlatformService.removeRemoteUrl();
//   const remoteUrl = await gitPlatformService.isThereRemoteUrl();
//   expect(remoteUrl).toEqual(false);
//   await gitPlatformService.setRemoteUrl('https://github.com/fika-dev/fika-cli-test-samples.git');
// });

// test('8. test isThereRemoteUrl return true', async () => { 
//   const gitPlatformService = container.get<IGitPlatformService>(
//     SERVICE_IDENTIFIER.GitPlatformService
//   );
//   const remoteUrl = await gitPlatformService.isThereRemoteUrl();
//   expect(remoteUrl).toEqual(true);
//   });

