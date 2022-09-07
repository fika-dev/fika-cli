import { checkoutFeatureBranchAction } from "@/command/checkout-feature-branch/checkout-feature-branch.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { exec } from "child_process";
import { program } from "commander";
import exp from "constants";
import { TEST_CPR_BRANCH_NAME } from "test/test-constants";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
import { checkoutFeatureBranchCommand } from "../../../src/command/checkout-feature-branch";
import { makeMeaninglessChange, stageAndCommit, checkAndCloneRepo, createTestConfig, deleteBranch, restoreGitRepo, setUseToken } from "test/test-utils";

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
//   jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
//   jest.spyOn(console, "log").mockImplementation((m)=>console.log(m));
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

it("1.test if checkoutFeatureBranch go to the latest feature branch", async () => {
    const testBranch = "feature/iss/#344";
    await gitPlatformService.checkoutToBranchWithoutReset(testBranch);
    makeMeaninglessChange('./test/testing-env/fika-cli-test-samples/sample_01/src/just-new-file.ts');
    await stageAndCommit('Just commit a meaningless change');
  await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
  await checkoutFeatureBranchAction();
    const currentBranch = await gitPlatformService.getBranchName();
    expect(currentBranch).toBe(testBranch);
});

it("2.test when no feature branch if getLatestBranchByCommitDate return undefined", async () => {
    jest.spyOn(gitPlatformService,'getSortedBranchesByCommitDate').mockImplementation(()=>Promise.resolve([]));
    const latesBranch = await gitPlatformService.getLatestBranchByCommitDate();
    expect(latesBranch).toBeUndefined();
});
 
it("3.test when no feature branch if checkoutFeaturebranch stay in ths same branch and send the correct warning", async () => {
    const beforeBranch = await gitPlatformService.getBranchName();
    jest.spyOn(gitPlatformService,'getLatestBranchByCommitDate').mockImplementation(()=>Promise.resolve(undefined));
    const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(() => { });
     await checkoutFeatureBranchAction();
    const afterBranch = await gitPlatformService.getBranchName();
    expect(beforeBranch).toEqual(afterBranch);
    expect(spy).toBeCalledWith("Could not find a feature branch that matches your request");
});
 
it("4.test when the branch number is a number", async () => {
const beforeBranch = await gitPlatformService.checkoutToBranchWithoutReset('develop');;
  await checkoutFeatureBranchAction(406);
  const afterBranch = await gitPlatformService.getBranchName();
  expect(afterBranch).toEqual("feature/iss/#406")
})

it('5.test when the branch is NOT a number', async () => {
  const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(() => { });
  await checkoutFeatureBranchAction('AR406' as any)
  expect(spy).toBeCalledWith("Could not understand your request, please provide a valid number");
   
})

it("6.test when the branch number is a number but the issue number doesn't exist", async () => {
  const beforeBranch = await gitPlatformService.checkoutToBranchWithoutReset('develop');
  const errorService = container.get<IErrorHandlingService>(
    SERVICE_IDENTIFIER.ErrorHandlingService
    );
   const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const spy = jest.spyOn(messageService, 'showError').mockImplementation((e) => e.message);
  try {
    await checkoutFeatureBranchAction(4067765);
    expect(spy).toBeCalledWith('No remote branch was found');
  } catch (e) {
    errorService.handle(e);
  }
})