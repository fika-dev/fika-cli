import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
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
  // jest.spyOn(console, "log").mockImplementation(()=>{});
  jest.spyOn(messageService, 'showCreatingGitIssue').mockImplementation(()=>{});
  jest.spyOn(messageService, 'showGettingIssue').mockImplementation(()=>{});
  jest.spyOn(configService, 'getNotionBotId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterAll(() => {
});

it("1.test git merge conflict", async ()=>{
  await gitPlatformService.checkoutToBranchWithoutReset("conflicting");
  await gitPlatformService.pullFrom("develop");
  const isConflictExist = await gitPlatformService.checkConflict();
  expect(isConflictExist).toEqual(true);
  await gitPlatformService.abortMerge();
})
