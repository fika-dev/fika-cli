import { finishAction } from "@/command/finish/finish.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { TEST_CPR_BRANCH_NAME } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, deleteBranch, restoreGitRepo, setUseToken } from "test/test-utils";

const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);

beforeAll(async () => {
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
  setUseToken(process.env.TESTING_USER_TOKEN);
});

beforeEach(async()=>{
  jest.restoreAllMocks();
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
  jest.spyOn(console, "log").mockImplementation(()=>true);
  jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  jest.spyOn(configService, 'getNotionBotId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  
})

afterAll(() => {
});

it("1.test git merge conflict", async ()=>{
  await gitPlatformService.checkoutToBranchWithoutReset("conflicting");
  await gitPlatformService.pullFrom("conflicting_2");
  const isConflictExist = await gitPlatformService.checkConflict();
  expect(isConflictExist).toEqual(true);
  await gitPlatformService.abortMerge();
  await gitPlatformService.checkoutToBranchWithoutReset("develop");
});

it("2.test finish without change & without merge check, without checkout", async ()=>{
  await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
  const localConfig = defaultLocalConfig;
  localConfig.finish.checkMergeConflict = false;
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  await finishAction();
  expect(spy).toBeCalled();
  const currentBranch = await gitPlatformService.getBranchName();
  expect(currentBranch).toBe(TEST_CPR_BRANCH_NAME);
  await deleteBranch(TEST_CPR_BRANCH_NAME);
});

it("3.test finish without change & without merge check, with checkout", async ()=>{
  await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
  const localConfig = defaultLocalConfig;
  localConfig.finish.checkMergeConflict = false;
  localConfig.finish.checkOutToDevelop = true;
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  await finishAction();
  expect(spy).toBeCalled();
  const currentBranch = await gitPlatformService.getBranchName();
  expect(currentBranch).toBe('develop');
  await deleteBranch(TEST_CPR_BRANCH_NAME);
});
