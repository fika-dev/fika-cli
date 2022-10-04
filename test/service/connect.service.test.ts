import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import { TEST_HTTPS_GITHUB_REPO, TEST_JIRA_WORKSPACE_ID, TEST_NOTION_WORKSPACE_ID, TEST_START_DOC_ID, TEST_START_DOC_JIRA_URL, TEST_START_ISSUE } from "test/test-constants";
import { checkAndCloneRepo, createTestConfig, restoreGitRepo, setUseToken } from "test/test-utils";

const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);

beforeAll(async () => {
  jest.restoreAllMocks();
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
  setUseToken(process.env.TESTING_USER_TOKEN);
});

beforeEach(async()=>{
  jest.restoreAllMocks();
  jest.spyOn(configService, 'getWorkspaceId').mockImplementation(()=>new Uuid(TEST_NOTION_WORKSPACE_ID));
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterEach(async ()=>{
  

})

afterAll(() => {
  
});

describe("0. test connect workspace", () => {
  it("0.1. test requestWorkspace notion", async () => {
    const workspace = await connectService.requestWorkspace('notion', new Uuid(TEST_NOTION_WORKSPACE_ID));
    expect(workspace.id).toBeDefined();
    expect(workspace.workspaceName).toBeDefined();
    expect(workspace.workspaceType).toBe('notion');
  });
  it("0.2. test requestWorkspace jira", async () => {
    const workspace = await connectService.requestWorkspace('jira', new Uuid(TEST_JIRA_WORKSPACE_ID));
    expect(workspace.id).toBeDefined();
    expect(workspace.workspaceName).toBeDefined();
    expect(workspace.workspaceType).toBe('jira');
  });

  it("0.3. test hash", async () => {
    const hash = await connectService.getHash();
    expect(hash.length).toBe(72);
  });
});



describe("1. test workspace issue", () => {
  it("1.1. test notion getIssue", async () => {
    const issue = await connectService.getWorkspaceIssue(TEST_START_DOC_ID, new Uuid(TEST_NOTION_WORKSPACE_ID), 'notion');
    expect(issue).toEqual({
      gitIssueUrl: undefined,
      issueUrl: 'https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd',
      title: 'test fika start doc',
      body: 'Notion Document: https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd',
      labels: []
    });
  });
  it("1.2. test jira getIssue", async () => {
    const issue = await connectService.getWorkspaceIssue(TEST_START_DOC_JIRA_URL, new Uuid(TEST_JIRA_WORKSPACE_ID), 'jira');
    expect(issue).toEqual({
      gitIssueUrl: undefined,
      issueUrl: 'https://fika-dev.atlassian.net/browse/FB-1',
      title: 'test issue',
      body: 'Jira Issue Document: https://fika-dev.atlassian.net/browse/FB-1',
      labels: []
    });
  });
});

describe("2. test issue record", () => {
  const gitRepoUrl = TEST_HTTPS_GITHUB_REPO.replace('.git','');
  const issueNumber = 510;
  it("2.1. test createIssueRecord", async () => {
    const branchName = configService.getIssueBranch(issueNumber);
    const issue = {...TEST_START_ISSUE, gitIssueUrl: `${gitRepoUrl}/issues/${issueNumber}`, branchName};
    await connectService.createIssueRecord(issue);
    const issueRecord = await connectService.getIssueRecord(Issue.parseNumberFromUrl(issue.gitIssueUrl), TEST_HTTPS_GITHUB_REPO.replace('.git',''));
    const issueRecord2 = await connectService.getIssueRecordByPage(issue.issueUrl, TEST_HTTPS_GITHUB_REPO.replace('.git',''));
    expect(issueRecord.issueUrl).toEqual(issue.issueUrl);
    expect(issueRecord.branchName).toEqual(issue.branchName);
    expect(issueRecord.gitIssueUrl).toBeDefined();
    expect(issueRecord2).toEqual(issueRecord);
  });

  it("2.2. test delete record", async () => {
    await connectService.deleteIssueRecord(gitRepoUrl, issueNumber);
    try{
      await connectService.getIssueRecord(issueNumber, gitRepoUrl);
    }catch(e){
      expect(e.message).toBe('Request failed with status code 404');
    }
  });
});


describe("3. test auth related API", () => {
  it("3.1. test isAvailableEmail", async () => {
    const sholdBeFalse = await connectService.isAvailableEmail("wonmo.jung@kkiri.app");
    expect(sholdBeFalse).toBe(false);
    const shouldBeTrue = await connectService.isAvailableEmail("untested@kkiri.app");
    expect(shouldBeTrue).toBe(true);
  });
});


