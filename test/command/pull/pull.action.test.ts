import { pullAction } from "@/command/pull/pull.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { clearLocalConfig, clearTestFikaPath, readLocalConfig, sendPromptData } from "test/test-utils";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);

afterEach(()=>{
  jest.clearAllMocks();
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

beforeEach(()=>{
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

beforeAll(() => {
  jest.spyOn(promptService, 'confirmAction').mockImplementation((message: string) => Promise.resolve(true));
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

afterAll(async () => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
});


test('1.test pullAction when successfuly merged', async () => { 
     const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
     );
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  let branchName: string;
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  jest.spyOn(gitPlatformService, "pullFrom").mockImplementation(async (branch: string) => {
    branchName = branch;
    return "UPDATED";
  });
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
  await pullAction();
  expect(branchName).toEqual('develop');
  expect(spy).toBeCalledWith('Synced from origin develop');
});

test('2.test pullAction when there is nothing to update', async () => { 
     const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
     );
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  let branchName: string;
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  jest.spyOn(gitPlatformService, "pullFrom").mockImplementation(async (branch: string) => {
    branchName = branch;
    return "NO_CHANGE";
  });
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation( () => {});
  await pullAction();
  expect(branchName).toEqual('develop');
  expect(spy).toBeCalledWith('nothing to update from origin develop');
});

test('3.test pullAction when successfuly merged', async () => { 
     const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
     );
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  let branchName: string;
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  jest.spyOn(gitPlatformService, "pullFrom").mockImplementation(async (branch: string) => {
    branchName = branch;
    return "NO_REMOTE_BRANCH";
  });
  const spy = jest.spyOn(messageService, 'showWarning').mockImplementation(() => { });
  await pullAction();
  expect(branchName).toEqual('develop');
  expect(spy).toBeCalledWith('failed to pull because the develop branch could not be found');
});

test('4.test pullAction when there is something wrong', async () => { 
     const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
     );
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  let branchName: string;
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  jest.spyOn(gitPlatformService, "pullFrom").mockImplementation(async (branch: string) => {
    branchName = branch;
    return "REMOTE_CONFLICT";
  });
    const spy = jest.spyOn(messageService, 'showWarning').mockImplementation( () => {});
  await pullAction();
  expect(branchName).toEqual('develop');
  expect(spy).toBeCalledWith('failed to pull on the develop branch');
});