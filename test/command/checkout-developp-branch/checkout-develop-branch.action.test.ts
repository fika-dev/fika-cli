import { checkoutDevelopBranchAction } from "@/command/checkout-develop/checkout-develop-branch.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { restoreGitRepo } from "test/test-utils";

const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);

beforeAll(async () => {
});

beforeEach(async()=>{
  jest.restoreAllMocks();
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
  jest.spyOn(console, "log").mockImplementation(()=>true);
  jest.spyOn(promptService, "confirmAction").mockImplementation(()=>Promise.resolve(true));
  jest.spyOn(messageService, 'showSuccess').mockImplementation(() =>undefined);
  jest.spyOn(configService, 'getWorkspaceId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  messageService.endWaiting();

})

afterAll(() => {
  
});


it("1.test checkout-develop-branch if develop branch is an empty string", async () => {
    const localConfig = defaultLocalConfig;
    localConfig.branchNames.develop = "";
  const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(()=>{});
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(()=>Promise.resolve(localConfig));
  await checkoutDevelopBranchAction();
  expect(spy).toBeCalledWith("Could not complete the action because your Fika config file does not contain any value for the develop branch.");
  });

it("2.test checkout-develop-branch if develop branch is undefined", async () => {
  const localConfig = defaultLocalConfig;
  localConfig.branchNames.develop = undefined;
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(()=>Promise.resolve(localConfig));
  const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(()=>{});
  await checkoutDevelopBranchAction();
  expect(spy).toBeCalledWith("Could not complete the action because your Fika config file does not contain any value for the develop branch.");
});

