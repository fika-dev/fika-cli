import { startAction } from "@/command/start/start.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES } from "@/config/constants/messages";
import container from "@/config/ioc_config";
import { GitPlatform } from "@/domain/entity/add_on/git_platform.entity";
import { GitCommand } from "@/domain/git-command/command.types";
import { checkoutCmd, createBranchCmd, fetchCmd, getBranchesCmd, getCurrentBranchCmd, getGitRepoPathCmd, getRemoteBranchesCmd,  getRemoteUrlCmd, pullFromCmd, statusCmd } from "@/domain/git-command/git-command.values";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { WorkspaceNotConnected } from "@/domain/value_object/exceptions/workspace_not_connected";
import { Uuid } from "@/domain/value_object/uuid.vo";
import * as T from 'fp-ts/Task';
import { TEST_BRANCH_LIST, TEST_GIT_CLEAN_STATUS, TEST_GIT_PULL_UPDATED_OUTPUT, TEST_GIT_STATUS_WITH_STAGED, TEST_HTTPS_GITHUB_REPO, TEST_REMOTE_BRANCHES, TEST_SSH_GITHUB_REPO, TEST_STARTED_DOC_URL, TEST_START_DOC_URL } from "test/test-constants";
import { setUseToken, spyWithMock } from "test/test-utils";

const gitPlatform = container.get<GitPlatform>(SERVICE_IDENTIFIER.GitPlatform);
const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
const defaultMock = (additionalMock)=> (cmd: GitCommand) => {
  const t = additionalMock(cmd);
  if (t !== undefined){
    return t
  }else{
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_UPDATED_OUTPUT);
    }if (cmd.command === getCurrentBranchCmd.command){
      return T.of('main');
    }if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }if (cmd.command === checkoutCmd.command){
      return T.of('');
    }if (cmd.command === createBranchCmd.command){
      return T.of('');
    }if (cmd.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_LIST);
    }if (cmd.command === getRemoteBranchesCmd.command){
      return T.of(TEST_REMOTE_BRANCHES);
    }if (cmd.command === fetchCmd.command){
      return T.of('');
    }if (cmd.command === getGitRepoPathCmd.command){
      return T.of(process.env.TESTING_REPO_PATH);
    }if (cmd.command === getRemoteUrlCmd.command){
      return T.of(TEST_SSH_GITHUB_REPO);
    }
    throw cmd;
  }
}

beforeAll(async () => {
  // createTestConfig(process.env.TESTING_PATH + "/.fika");
  setUseToken(process.env.TESTING_USER_TOKEN);
  jest.restoreAllMocks();
  jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  jest.spyOn(configService, 'getWorkspaceId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  jest.spyOn(configService, 'getWorkspaceType').mockImplementation(()=>'notion');
  jest.spyOn(connectService, 'getIssueRecordByPage').mockImplementation((docUrl, _)=>{
    if (docUrl === TEST_STARTED_DOC_URL) {
      return Promise.resolve({
        id: 'a38a4d5d-1407-4fce-a7ec-192d8ab58495',
        title: 'test fika start doc',
        issueUrl: 'https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd',
        gitIssueUrl: 'https://github.com/fika-dev/fika-cli-test-samples/issues/2',
        labels: [],
        branchName: 'feature/iss/#2'
      });
    }else if (docUrl === TEST_START_DOC_URL){
      return Promise.resolve(undefined);
    }
  });
  jest.spyOn(connectService, 'createIssueRecord').mockImplementation((issue)=>Promise.resolve(undefined));
  jest.spyOn(gitPlatform, 'createIssue').mockImplementation((issue)=>{
    const updated = {
      ...issue,
      gitIssueUrl: 'https://github.com/fika-dev/fika-cli-test-samples/issues/1507'
    }
    return Promise.resolve(updated);
  });
});

beforeEach(async()=>{
  
});

afterEach(async() => {
  await messageService.endWaiting();
});




// test('1. start an issue without issue url', async () => { 
// });

// NEED TO ADD VALIDATION FOR URL
// test('2. start with not correct issue url (https://xyw.abcd.kr)', async () => { 
// });

// NEED TO BE HANDLED IN SERVER SIDE
// test('3. start an issue of different workspace', async () => {
// });

test('4. start an issue without connected workspace', async () => {
  spyWithMock(defaultMock((_)=>undefined));
  jest.spyOn(configService, 'getWorkspaceId').mockImplementationOnce(()=>{throw new WorkspaceNotConnected("WORKSPACE_NOT_CONNECTED");});
  try{
    await startAction(TEST_START_DOC_URL);
    expect(true).toBe(false);
  }catch(e){
    expect(e).toBeInstanceOf(WorkspaceNotConnected);
  }
});

// test('5. start before login', async () => {});

test('6. start from the feature branch', async () => {
  const localConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
  localConfig.start.fromDevelopOnly = true;
  jest.spyOn(configService, 'getLocalConfig').mockImplementation(() => localConfig);
  const spy = jest.spyOn(messageService, "showWarning").mockImplementationOnce(()=>undefined);
  spyWithMock(defaultMock((cmd)=>{
    if (cmd.command === getCurrentBranchCmd.command){
      return T.of('feature/iss/#2');
    }else{
      return undefined;
    }
  }));
  await startAction(TEST_START_DOC_URL);
  expect(spy).toHaveBeenCalledWith(`(current branch is feature/iss/#2) ${defaultLocalConfig.branchNames.develop} is the only allowed branch to start`)
});

test('7. start an issue uncommitted changes from develop branch', async () => {
  const spy = jest.spyOn(promptService, "confirmAction").mockImplementation((m) => Promise.resolve(false));
  spyWithMock(defaultMock((cmd)=>{
    if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }else{
      return undefined;
    }
  }));
  try{
    await startAction(TEST_START_DOC_URL);
  }catch(e){
    expect(e.subType).toEqual('UserCancel');
    expect(spy).toHaveBeenCalledWith(MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES);
  }
});

test('8. start from develop with git clean status', async () => {
  spyWithMock(defaultMock((cmd)=>{
    if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }if (cmd.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_LIST+'\nfeature/iss/#1507');
    }
    return undefined;
  }));
  await startAction(TEST_START_DOC_URL);
  expect(messageService.showSuccess).toHaveBeenNthCalledWith(4, 'Checkout to branch: feature/iss/#1507');
  
});

test('9.1. start already started issue not in local', async () => {
  spyWithMock(defaultMock((cmd)=>{
    if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    return undefined;
  }));
  await startAction(TEST_STARTED_DOC_URL);
  expect(messageService.showSuccess).toHaveBeenNthCalledWith(1, 'Checkout to branch: feature/iss/#2');
});

test('9.2. start already started issue existing in local', async () => {
  spyWithMock(defaultMock((cmd)=>{
    if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }if (cmd.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_LIST+'\nfeature/iss/#2');
    }if (cmd.command === createBranchCmd.command){
      throw cmd.argument;
    }
    return undefined;
  }));
  await startAction(TEST_STARTED_DOC_URL);
  expect(messageService.showSuccess).toHaveBeenNthCalledWith(1, 'Checkout to branch: feature/iss/#2');
});


// test('10. start an issue which is not accessible to fika', async () => {});
