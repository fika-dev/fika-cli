import { checkoutDevelopBranchAction } from "@/command/checkout-develop/checkout-develop-branch.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
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
  jest.restoreAllMocks();
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
  jest.spyOn(console, "log").mockImplementation(()=>true);
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

it("1.test checkout-develop-branch if develop was set", async () => {
    const localConfig = defaultLocalConfig;
  localConfig.branchNames.develop = "develop";
  await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
    await checkoutDevelopBranchAction();
    const currentBranch = await gitPlatformService.getBranchName();
  expect(currentBranch).toBe("develop");
});

it("2.test checkout-develop-branch if develop branch is an empty string", async () => {
    const localConfig = defaultLocalConfig;
    localConfig.branchNames.develop = "";
  const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(()=>{});
  await checkoutDevelopBranchAction();
  expect(spy).toBeCalledWith("Could not complete the action because your Fika config file does not contain any value for the develop branch.");
  });

it("3.test checkout-develop-branch if develop branch is undefined", async () => {
    const localConfig = defaultLocalConfig;
    localConfig.branchNames.develop = undefined;
  const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(()=>{});
  await checkoutDevelopBranchAction();
  expect(spy).toBeCalledWith("Could not complete the action because your Fika config file does not contain any value for the develop branch.");
});

