import { startAction } from "@/command/start/start.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { TEST_CHANGE_FILE_PATH, TEST_CPR_BRANCH_NAME, TEST_START_DOC_ID } from "test/test-constants";
import { checkAndCloneRepo, checkAndDeleteIssue, createTestConfig, makeMeaninglessChange, restoreGitRepo, setAuthToken, setUseToken } from "test/test-utils";

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
  jest.spyOn(configService, 'getWorkspaceType').mockImplementation(()=>'notion');
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(() => {
  messageService.endWaiting();
});

test('1. test pull from develop', async () => {
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await gitPlatformService.pullFrom('develop');
});

test('2. check unstaged change', async () => {
  await gitPlatformService.checkoutToBranchWithReset(TEST_CPR_BRANCH_NAME);
  const isChanged = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged).toBe(false);
  makeMeaninglessChange(TEST_CHANGE_FILE_PATH);
  const isChanged2 = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged2).toBe(true);
  await gitPlatformService.stash('tmp');
  const isChanged3 = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged3).toBe(false);
  await gitPlatformService.applyStash('tmp');
  const isChanged4 = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged4).toBe(true);
});

test('2.1. catch user stopped exception', async () => {
  await checkAndDeleteIssue(TEST_START_DOC_ID);
  makeMeaninglessChange(TEST_CHANGE_FILE_PATH);
  const spy = jest.spyOn(promptService, "confirmAction").mockImplementationOnce((m)=>{
    return Promise.resolve(false)
  });
  let message: string
  try{
    await startAction(TEST_START_DOC_ID)
  }catch(e){
    const exception = e as BaseException;
    message = exception.name;
  }
  await gitPlatformService.stash('tmp');
  expect(message).toEqual("UserStopped:UnstagedChange");
});

test('3. test start action without existing issue', async () => {
  await checkAndDeleteIssue(TEST_START_DOC_ID);
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  await gitPlatformService.checkoutToBranchWithReset('develop');
  await startAction(TEST_START_DOC_ID);
  const branchName = await gitPlatformService.getBranchName();
  expect(branchName).toContain('feat');
  expect(spy).toBeCalled();
});

test('4. test checkout to existing issue', async () => {
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  await gitPlatformService.checkoutToBranchWithReset('develop');
  await startAction(TEST_START_DOC_ID);
  const branchName = await gitPlatformService.getBranchName();
  expect(branchName).toContain('feat');
  expect(spy).toBeCalled();
});

test('5. test without checkout ', async () => {
  await checkAndDeleteIssue(TEST_START_DOC_ID);
  const checkoutFalse = defaultLocalConfig;
  checkoutFalse.start.checkoutToFeature = false;
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => checkoutFalse);
  await gitPlatformService.checkoutToBranchWithReset('develop');
  await startAction(TEST_START_DOC_ID);
  const branchName = await gitPlatformService.getBranchName();
  expect(branchName).toEqual('develop');
});

test('6. test only allowed branch warning ', async () => {
  await checkAndDeleteIssue(TEST_START_DOC_ID);
  jest.spyOn(promptService, 'confirmAction').mockImplementation(async () => true);
  let isWarningMessageCorrect: boolean;
  const spyWarning = jest.spyOn(messageService, 'showWarning').mockImplementation((message)=>{
    if (message.includes('only allowed branch')){
      isWarningMessageCorrect = true;
    }else{
      isWarningMessageCorrect = false;
    }
  });
  const spySuccess = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  await gitPlatformService.checkoutToBranchWithReset('something');
  await startAction(TEST_START_DOC_ID);
  const branchName = await gitPlatformService.getBranchName();
  expect(branchName).toEqual('something');
  expect(spyWarning).toBeCalled();
  expect(spySuccess).not.toBeCalled();
  expect(isWarningMessageCorrect).toEqual(true);
});


test('7. test nok OK to start ', async () => {
  await checkAndDeleteIssue(TEST_START_DOC_ID);
  const localConfig = defaultLocalConfig;
  localConfig.start.fromDevelopOnly = false;
  localConfig.start.pullBeforeAlways = false;
  localConfig.start.checkoutToFeature = true;
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
  const spyConfirm = jest.spyOn(promptService, 'confirmAction').mockImplementation(async () => true);
  const spySuccess = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  await gitPlatformService.checkoutToBranchWithReset('something');
  await startAction(TEST_START_DOC_ID);
  const branchName = await gitPlatformService.getBranchName();
  expect(spyConfirm).toBeCalled();
  expect(spySuccess).toBeCalled();
  expect(branchName).toContain('feat');
});




