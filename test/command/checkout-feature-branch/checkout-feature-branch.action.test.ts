import { checkoutFeatureBranchAction } from "@/command/checkout-feature-branch/checkout-feature-branch.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { ExecuteGitCommand } from "@/domain/git-command/command.types";
import { createBranchCmd, fetchCmd, getBranchesCmd, getRemoteBranchesCmd, getRemoteUrlCmd } from "@/domain/git-command/git-command.values";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import * as T from 'fp-ts/Task';
import { TEST_BRANCH_SORTED, TEST_CPR_BRANCH_NAME, TEST_GIT_CLEAN_STATUS, TEST_HTTPS_GITHUB_REPO, TEST_REMOTE_BRANCHES } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, restoreGitRepo, setUseToken } from "test/test-utils";

const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);

beforeAll(async () => {
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
  setUseToken(process.env.TESTING_USER_TOKEN);
});

beforeEach(async()=>{
  jest.restoreAllMocks();
  jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  jest.spyOn(configService, 'getWorkspaceId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  messageService.endWaiting();

})

afterAll(() => {
  
});

it("1.test when the branch number is a number", async () => {
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const spy = jest.spyOn(connectService, 'getIssueRecord').mockImplementationOnce(()=>Promise.resolve({
    title: '',
    issueUrl: '',
    labels: [],
    branchName: 'feature/iss/#406'
  }))
  let checkoutBranch: string;
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    if (gitCommand.command === createBranchCmd.command){
      return T.of('');
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
    if (gitCommand.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_SORTED)
    }
    if (gitCommand.command === getRemoteBranchesCmd.command){
      return T.of(TEST_REMOTE_BRANCHES)
    }
    if (gitCommand.command === fetchCmd.command){
      return T.of('');
    }
    if (gitCommand.command === getRemoteUrlCmd.command){
      return T.of(TEST_HTTPS_GITHUB_REPO);
    }
  }
  const spy2 = jest.spyOn(commanderService, 'executeGitCommand').mockImplementation((cmd)=>mockExecuteWithChange(cmd));
  await checkoutFeatureBranchAction(406);
  expect(checkoutBranch).toEqual("feature/iss/#406")
})


it("2.test without number", async () => {
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  let checkoutBranch: string;
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    console.log('🧪', ' in CheckoutFeatureBranchActionTest: ', 'gitCommand: ',gitCommand);
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    if (gitCommand.command === createBranchCmd.command){
      return T.of('');
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
    if (gitCommand.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_SORTED)
    }
    if (gitCommand.command === getRemoteBranchesCmd.command){
      return T.of(TEST_REMOTE_BRANCHES)
    }
    if (gitCommand.command === fetchCmd.command){
      return T.of('');
    }
    if (gitCommand.command === getRemoteUrlCmd.command){
      return T.of(TEST_HTTPS_GITHUB_REPO);
    }
  }
  jest.spyOn(commanderService, 'executeGitCommand').mockImplementation((cmd)=>mockExecuteWithChange(cmd));
  await checkoutFeatureBranchAction();
  expect(checkoutBranch).toEqual(TEST_CPR_BRANCH_NAME)
})

// it('5.test when the branch is NOT a number', async () => {
//   const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(() => { });
//   await checkoutFeatureBranchAction('AR406' as any)
//   expect(spy).toBeCalledWith("Could not understand your request, please provide a valid number");
   
// })

// it("6.test when the branch number is a number but the issue number doesn't exist", async () => {
//   const beforeBranch = await gitPlatformService.checkoutToBranchWithoutReset('develop');
//   const errorService = container.get<IErrorHandlingService>(
//     SERVICE_IDENTIFIER.ErrorHandlingService
//     );
//    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
//   const spy = jest.spyOn(messageService, 'showError').mockImplementation((e) => e.message);
//   try {
//     await checkoutFeatureBranchAction(4067765);
//     expect(spy).toBeCalledWith('No remote branch was found');
//   } catch (e) {
//     errorService.handle(e);
//   }
// })