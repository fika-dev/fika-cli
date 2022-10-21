import { infoAction } from "@/command/info/info.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { TEST_CPR_BRANCH_NAME, TEST_GIT_REPO_PATH, TEST_HTTPS_GITHUB_REPO } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, restoreGitRepo, setUseToken, spyWithMock } from "test/test-utils";
import { IConnectService } from "@/domain/service/i_connect.service";
import { defaultLocalConfig } from "@/config/constants/default_config";
import { GitCommand } from "@/domain/git-command/command.types";
import { getCurrentBranchCmd, getGitRepoPathCmd, getRemoteUrlCmd } from "@/domain/git-command/git-command.values";
import * as T from 'fp-ts/Task';

const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
const copiedLocalConfig = {
    ...defaultLocalConfig,
    branchNames: {
        develop: "develop",
        main: "main",
        release: "release",
        issueBranchTemplate: 'feature/iss/#<ISSUE_NUMBER>',
    }
};

const defaultMock = (additionalMock)=> (cmd: GitCommand) => {
    const t = additionalMock(cmd);
    if (t !== undefined){
      return t
    }else{
      if (cmd.command === getRemoteUrlCmd.command){
        return T.of(TEST_HTTPS_GITHUB_REPO);
      }if (cmd.command === getCurrentBranchCmd.command){
        return T.of(TEST_CPR_BRANCH_NAME);
      }if (cmd.command === getGitRepoPathCmd.command){
        return T.of(TEST_GIT_REPO_PATH);
      }
      throw cmd;
    }
  }
  

beforeAll(async () => {
  jest.restoreAllMocks();
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
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  messageService.endWaiting();

})

afterAll(() => {
  
});



it("1.test info on a issue branch", async () => {
    spyWithMock(defaultMock((cmd)=>{
        if (cmd.command === getCurrentBranchCmd.command){
            return T.of(TEST_CPR_BRANCH_NAME);
        }
        return undefined;
      }));
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    jest.spyOn(connectService, 'getIssueRecord').mockImplementation(async () => {
        return {
            gitIssueUrl: 'https://some.thing',
            issueUrl: 'https://other.thing',
            title: 'test is the best',
            labels: [],
            gitPrUrl: 'https://ts.4.8'} as Issue} );
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith(`The current branch is ${TEST_CPR_BRANCH_NAME}, test is the best`, "The Git issue URL is ", "https://some.thing");
    expect(spy).toBeCalledWith("For more Information, please take a look at the page linked below:", undefined, "https://other.thing");
    expect(spy).toBeCalledWith("And finally, you can take a look at the PR with the link below", undefined, "https://ts.4.8");
});

it("2.test info message for the develop branch", async () => {
    spyWithMock(defaultMock((cmd)=>{
        if (cmd.command === getCurrentBranchCmd.command){
            return T.of(copiedLocalConfig.branchNames.develop);
        }
        return undefined;
      }));
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith('You are on the develop branch, you can start a new branch with "fika start <issue url>"', undefined);
});

it("3.test info message for the release branch", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    spyWithMock(defaultMock((cmd)=>{
        if (cmd.command === getCurrentBranchCmd.command){
            return T.of(copiedLocalConfig.branchNames.release);
        }
        return undefined;
      }));
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith('You are on the release branch, you can start a new branch with "fika start <issue url>"', undefined);
});

it("4.test info message for the main branch", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    spyWithMock(defaultMock((cmd)=>{
        if (cmd.command === getCurrentBranchCmd.command){
            return T.of(copiedLocalConfig.branchNames.main);
        }
        return undefined;
      }));
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith('You are on the main branch, you can start a new branch with "fika start <issue url>"', undefined);
});

it("5.test info message for a not parserble branch", async () => {
    spyWithMock(defaultMock((cmd)=>{
        if (cmd.command === getCurrentBranchCmd.command){
            return T.of('something_other');
        }
        return undefined;
      }));
    jest.spyOn(connectService, 'getIssueRecord').mockImplementation(async () => {
        return null as Issue} );
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith("We failed to retrive some information on your branch, please again later");
});

it("6.test info with testing server", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    spyWithMock(defaultMock((cmd)=>{
        if (cmd.command === getCurrentBranchCmd.command){
            return T.of(TEST_CPR_BRANCH_NAME);
        }
        return undefined;
      }));
    await infoAction();
    expect(spy).toHaveBeenCalledWith(`The current branch is ${TEST_CPR_BRANCH_NAME}, test document`, "The Git issue URL is ", "https://github.com/fika-dev/fika-cli-test-samples/issues/2");
});