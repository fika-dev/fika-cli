import { infoAction } from "@/command/info/info.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { TEST_CPR_BRANCH_NAME } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, restoreGitRepo, setUseToken } from "test/test-utils";
import { IConnectService } from "@/domain/service/i_connect.service";
import { defaultLocalConfig } from "@/config/constants/default_config";

const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
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
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  messageService.endWaiting();

})

afterAll(() => {
  
});

// it("1.test git merge conflict", async ()=>{
//   await gitPlatformService.checkoutToBranchWithoutReset("conflicting");
//   await gitPlatformService.pullFrom("conflicting_2");
//   const isConflictExist = await gitPlatformService.checkConflict();
//   expect(isConflictExist).toEqual(true);
//   await gitPlatformService.abortMerge();
//   await gitPlatformService.checkoutToBranchWithoutReset("develop");
// });

it("1.test info on a issue branch", async () => {
    jest.spyOn(gitPlatformService, 'getGitRepoUrl').mockImplementation(async () => 'https://github.com/tuxshido/repo');
    jest.spyOn(gitPlatformService, 'getBranchName').mockImplementation(async () => 'feature/issue/133');
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
    expect(spy).toBeCalledWith("The current branch is feature/issue/133, test is the best", "The Git issue URL is ", "https://some.thing");
    expect(spy).toBeCalledWith("For more Information, please take a look at the page linked below:", undefined, "https://other.thing");
    expect(spy).toBeCalledWith("And finally, you can take a look at the PR with the link below", undefined, "https://ts.4.8");
});

it("2.test info message for the develop branch", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    jest.spyOn(gitPlatformService, 'getGitRepoUrl').mockImplementation(async () => Promise.resolve('https://github.com/tuxshido/repo'));
    jest.spyOn(gitPlatformService, 'getBranchName').mockImplementation(async () => Promise.resolve('develop'));
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith('You are on the develop branch, you can start a new branch with "fika start <issue url>"', undefined);
});

it("3.test info message for the release branch", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    jest.spyOn(gitPlatformService, 'getGitRepoUrl').mockImplementation(async () => Promise.resolve('https://github.com/tuxshido/repo'));
    jest.spyOn(gitPlatformService, 'getBranchName').mockImplementation(async () => Promise.resolve('release'));
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith('You are on the release branch, you can start a new branch with "fika start <issue url>"', undefined);
});

it("4.test info message for the main branch", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    jest.spyOn(gitPlatformService, 'getGitRepoUrl').mockImplementation(async () => Promise.resolve('https://github.com/tuxshido/repo'));
    jest.spyOn(gitPlatformService, 'getBranchName').mockImplementation(async () => Promise.resolve(defaultLocalConfig.branchNames.main));
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith('You are on the main branch, you can start a new branch with "fika start <issue url>"', undefined);
});

it("5.test info message for a non-valid", async () => {
    jest.spyOn(gitPlatformService, 'getGitRepoUrl').mockImplementation(async () => Promise.resolve('https://github.com/tuxshido/repo'));
    jest.spyOn(gitPlatformService, 'getBranchName').mockImplementation(async () => Promise.resolve('nan'));
    jest.spyOn(connectService, 'getIssueRecord').mockImplementation(async () => {
        return null as Issue} );
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await infoAction();
    expect(spy).toBeCalledWith("We failed to retrive some information on your branch, please again later");
});

it("6.test info with testing server", async () => {
    jest.spyOn(configService, 'getLocalConfig').mockImplementation(async () => copiedLocalConfig);
    const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
    await gitPlatformService.checkoutToBranchWithoutReset(TEST_CPR_BRANCH_NAME);
    await infoAction();
    expect(spy).toHaveBeenCalledWith("The current branch is feature/iss/#2, test document", "The Git issue URL is ", "https://github.com/fika-dev/fika-cli-test-samples/issues/2");
});