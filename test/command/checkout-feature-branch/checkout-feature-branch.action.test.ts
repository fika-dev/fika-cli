import { checkoutFeatureBranchAction } from "@/command/checkout-feature-branch/checkout-feature-branch.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import { checkAndCloneRepo, createTestConfig, restoreGitRepo, setUseToken } from "test/test-utils";
import * as T from 'fp-ts/Task';
import { TEST_BRANCH_LIST, TEST_CPR_BRANCH_NAME, TEST_GIT_CLEAN_STATUS, TEST_HTTPS_GITHUB_REPO } from "test/test-constants";
import { ExecuteGitCommand } from "@/domain/git-command/command.types";

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


const mockExecuteGitCommand: ExecuteGitCommand = (gitCommand) => {
  if (gitCommand.command === "branch --sort=-committerdate --format='%(refname:short)'"){
    return T.of(TEST_CPR_BRANCH_NAME);
  }
  else if (gitCommand.command === 'status'){
    return T.of(TEST_GIT_CLEAN_STATUS);
  }else if (gitCommand.command === 'rev-parse --abbrev-ref HEAD'){
    return T.of('Somthing strange is here');
  }else if (gitCommand.command === 'remote get-url'){
    return T.of(TEST_HTTPS_GITHUB_REPO);
  }else{
    return T.of(TEST_BRANCH_LIST);
  }
}


 
 
// it("4.test when the branch number is a number", async () => {
// const beforeBranch = await gitPlatformService.checkoutToBranchWithoutReset('develop');;
//   await checkoutFeatureBranchAction(406);
//   const afterBranch = await gitPlatformService.getBranchName();
//   expect(afterBranch).toEqual("feature/iss/#406")
// })

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