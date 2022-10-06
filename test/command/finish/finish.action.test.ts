import { createPR } from "@/actions/complex/create-PR.action";
import { finishAction } from "@/command/finish/finish.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import { GhPrAlreadyExists } from "@/domain/value_object/exceptions/gh_pr_already_exists";
import { Uuid } from "@/domain/value_object/uuid.vo";
import exp from "constants";
import { TEST_CPR_BRANCH_NAME } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, deleteBranch, restoreGitRepo, setUseToken } from "test/test-utils";

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
  // jest.restoreAllMocks();
  // jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
  // jest.spyOn(console, "log").mockImplementation(()=>true);
  // jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  // jest.spyOn(configService, 'getWorkspaceId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  // jest.spyOn(gitPlatformService, 'createPR').mockImplementation((issue)=>{
  //   const updated = {
  //     ...issue,
  //     gitPrUrl: 'https://github.com/fika-dev/fika-cli-test-samples/pull/1502'
  //   }
  //   return Promise.resolve(updated);
  // });
  // await gitPlatformService.checkoutToBranchWithoutReset('develop');
  // await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  messageService.endWaiting();

})

afterAll(() => {
  
});

// jest test function for only true case
test("finish action", async () => {
  // await finishAction();
});

// it("2.test finish without change & without merge check, without checkout", async () => {
//   try {
//     await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
//     const localConfig = defaultLocalConfig;
//     localConfig.finish.checkMergeConflict = false;
//     jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
//     jest.spyOn(promptService, 'confirmAction').mockImplementation((message: string) => message.includes("Do you wanna stay ")? Promise.resolve(true): Promise.resolve(false));
//     const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
//     await finishAction();
//     expect(spy).toBeCalled();
//     const currentBranch = await gitPlatformService.getBranchName();
//     expect(currentBranch).toBe(TEST_CPR_BRANCH_NAME);
//     await deleteBranch(TEST_CPR_BRANCH_NAME);  
//   } catch (e) {
//     // await deleteBranch(TEST_CPR_BRANCH_NAME);  
//   }
// });

// it("3.test finish without change & without merge check, with checkout", async () => {
  
//   await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
//   const localConfig = defaultLocalConfig;
//   localConfig.finish.checkMergeConflict = false;
//   localConfig.finish.checkOutToDevelop = true;
//   jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
//   const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
//   await finishAction();
//   expect(spy).toBeCalled();
//   const currentBranch = await gitPlatformService.getBranchName();
//   expect(currentBranch).toBe('develop');
//   await deleteBranch(TEST_CPR_BRANCH_NAME);  
  
  
// });

// it("4. checkOutToDevelop is false & confirm to stay", async () => {
//     await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
//     const localConfig = defaultLocalConfig;
//     localConfig.finish.checkOutToDevelop = false;
//     jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
//     jest.spyOn(promptService, 'confirmAction').mockImplementation(() => Promise.resolve(true));
//     const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
//     await finishAction();
//     expect(spy).toHaveBeenLastCalledWith("Staying in the current branch");
//     await deleteBranch(TEST_CPR_BRANCH_NAME);  
// });

// it("5. checkOutToDevelop is false & confirm to checkout to dev", async () => {
  
//     await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
//     const localConfig = defaultLocalConfig;
//     localConfig.finish.checkOutToDevelop = false;
//     jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
//     jest.spyOn(promptService, 'confirmAction').mockImplementation((message: string) => message.includes("Do you wanna stay ")? Promise.resolve(false): Promise.resolve(false));
//     await finishAction();
//     const currentBranch = await gitPlatformService.getBranchName();
//     expect(currentBranch).toBe('develop');
//     await deleteBranch(TEST_CPR_BRANCH_NAME);  
  
// });

// it("6. test when PR is already opened", async () => {
//     await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
//     jest.spyOn(gitPlatformService, 'createPR').mockImplementation(() => {
//       throw new GhPrAlreadyExists("GhPrAlreadyExists");
//     });
//     const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => {})
//   try {
//     await createPR();  
//   } catch (e) {
//     expect(spy).toBeCalledWith("PR link", undefined,'https://github.com/fika-dev/fika-cli-test-samples/pull/12');  
//   }
// });
