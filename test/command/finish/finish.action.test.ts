import { finishAction } from "@/command/finish/finish.action";
import { defaultLocalConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { GitPlatform } from "@/domain/entity/add_on/git_platform.entity";
import { GitCommand } from "@/domain/git-command/command.types";
import { checkoutCmd, createBranchCmd, fetchCmd, getBranchesCmd, getCurrentBranchCmd, getGitRepoPathCmd, getRemoteBranchesCmd, getRemoteUrlCmd, pullFromCmd, pushBranchCmd, statusCmd } from "@/domain/git-command/git-command.values";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import * as T from "fp-ts/Task";
import { TEST_BRANCH_LIST, TEST_CPR_BRANCH_NAME, TEST_GITHUB_URL, TEST_GIT_CLEAN_STATUS, TEST_GIT_PULL_CONFLICT_OUTPUT, TEST_GIT_PULL_UPDATED_OUTPUT, TEST_GIT_PUSH_OUTPUT, TEST_GIT_STATUS_WITH_STAGED, TEST_HTTPS_GITHUB_REPO, TEST_REMOTE_BRANCHES } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, setUseToken, spyWithMock } from "test/test-utils";

const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
const gitPlatform = container.get<GitPlatform>(SERVICE_IDENTIFIER.GitPlatform);

const defaultMock = (additionalMock)=> (cmd: GitCommand) => {
  const t = additionalMock(cmd);
  if (t !== undefined){
    return t
  }else{
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_UPDATED_OUTPUT);
    }if (cmd.command === getCurrentBranchCmd.command){
      return T.of('feature/iss/#2');
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
    }if (cmd.command === getRemoteUrlCmd.command){
      return T.of(TEST_HTTPS_GITHUB_REPO);
    }if (cmd.command === pushBranchCmd.command){
      return T.of(TEST_GIT_PUSH_OUTPUT);
    }if (cmd.command === getGitRepoPathCmd.command){
      return T.of(process.env.TESTING_REPO_PATH);
    }
    throw cmd;
  }
}


beforeAll(async () => {
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
  setUseToken(process.env.TESTING_USER_TOKEN);
  jest.restoreAllMocks();
  jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  jest.spyOn(configService, 'getWorkspaceId').mockImplementation(()=>new Uuid('d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac'));
  jest.spyOn(configService, 'getWorkspaceType').mockImplementation(()=>'notion');
  jest.spyOn(connectService, 'getIssueRecord').mockImplementation((issueNumber, gitRepoUrl)=>{
    if (issueNumber === 2 && (gitRepoUrl == TEST_GITHUB_URL)){
      return Promise.resolve({
        id: 'a38a4d5d-1407-4fce-a7ec-192d8ab58495',
        title: 'test fika start doc',
        issueUrl: 'https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd',
        gitIssueUrl: 'https://github.com/fika-dev/fika-cli-test-samples/issues/2',
        labels: [],
        branchName: 'feature/iss/#2'
      });
    }else {
      return Promise.resolve(undefined);
    }
  });
  jest.spyOn(connectService, 'updateWorkspaceIssue').mockImplementation((issue)=>{
    return Promise.resolve(issue);
  });
  jest.spyOn(connectService, 'createIssueRecord').mockImplementation((issue)=>Promise.resolve(undefined));
  jest.spyOn(gitPlatform, 'createPR').mockImplementation((issue)=>{
    const updated = {
      ...issue,
      gitPrUrl: "https://github.com/fika-dev/fika-cli-test-samples/pull/3"
    }
    return Promise.resolve(updated);
  });
});

beforeEach(async()=>{
});

afterEach(async ()=>{
  messageService.endWaiting();

})

afterAll(() => {
  
});

test("1. finish with uncommited changes", async ()=>{
  const spy = jest.spyOn(promptService, "confirmAction").mockImplementation(()=>Promise.resolve(true));
  spyWithMock(defaultMock((cmd: GitCommand) => {
    if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }
    return undefined;
  }))
  await finishAction();
  expect(spy).toBeCalledTimes(2);
})

test("2. finish from develop branch (after commit)", async ()=>{
  spyWithMock(defaultMock((cmd: GitCommand) => {
    if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }
    return undefined;
  }))
  try{
    await finishAction();
    expect(true).toEqual(false);
  }catch(e){
    expect(e.subType).toEqual('IssueRecordNotFound');
    expect(e.value).toEqual({
      issueNumber: NaN,
      gitRepoUrl: TEST_HTTPS_GITHUB_REPO.slice(0, -4)
    });
  }
})

test("3. finish but there is a conflict after pulling", async ()=>{
  spyWithMock(defaultMock((cmd: GitCommand) => {
    if (cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_CONFLICT_OUTPUT);
    }
    return undefined;
  }))
  try{
    await finishAction();
    expect(true).toEqual(false);
  }catch(e){
    expect(e.subType).toEqual('GitErrorMergeConflict');
  }
})

// test("4. finish issue which has been deleted from the workspace", async ()=>{})

// test("5. finish without git remote url", async ()=>{})

// test("6. finish with wrong remote url", async ()=>{})

test("7. Sean finish and everything works as expected", async ()=>{
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(()=>{});
  spyWithMock(defaultMock((_: GitCommand) => undefined));
  await finishAction();
  expect(spy).toHaveBeenNthCalledWith(1, `Synced from origin ${TEST_CPR_BRANCH_NAME}`);
  expect(spy).toHaveBeenNthCalledWith(2, `Synced from origin ${defaultLocalConfig.branchNames.develop}`);
  expect(spy).toHaveBeenNthCalledWith(3, "Pull Request Created", undefined, "https://github.com/fika-dev/fika-cli-test-samples/pull/3");
  expect(spy).toHaveBeenNthCalledWith(4, "Notion Issue Updated", undefined, "https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd");
})
