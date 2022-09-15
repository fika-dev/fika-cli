import { WorkspaceType } from "../entity/add_on/workspace_platform.entity";
import { DevObject } from "../entity/dev_object.entity";
import { Issue } from "../entity/issue.entity";
import { IssueWithPR } from "../entity/i_git_platform.service";
import { Workspace } from "../entity/workspace.entity";
import { UpdateInfo } from "../value_object/update-info.vo";
import { Uuid } from "../value_object/uuid.vo";
import { VersionTag } from "../value_object/version_tag.vo";

export interface UserWithToken {
  accessToken: string;
}

export interface IConnectService {
  requestWorkspace(workspaceType: WorkspaceType, workspaceId: Uuid): Promise<Workspace>;
  create(devObj: DevObject): Promise<string>;
  update(devObj: DevObject): Promise<string>;
  remove(devObj: DevObject): Promise<string>;
  getIssue(documentUrl: string, workspaceId: Uuid, workspaceType: WorkspaceType): Promise<Issue>;
  updateWorkspaceIssue(
    updatedIssue: Issue,
    workspaceId: Uuid,
    workspaceType: WorkspaceType
  ): Promise<Issue>;
  deleteIssue(gitRepoUrl: string, issueNumber: number): Promise<void>;
  useToken(token: string): void;
  isAvailableEmail(email: string): Promise<boolean>;
  requestOtpEmail(email: string, password: string): Promise<void>;
  signup(email: string, password: string, otpToken: string): Promise<UserWithToken>;
  signin(email: string, password: string): Promise<UserWithToken>;
  checkUpdate(currentVersion: string): Promise<UpdateInfo>;
  createIssueRecord(issue: Issue): Promise<void>;
  getIssueRecord(issueNumber: number, gitRepoUrl: string): Promise<Issue>;
  getIssueRecordByPage(issueUrl: string, gitRepoUrl: string): Promise<Issue>;
  createRelease(
    gitRepoUrl: string,
    tag: VersionTag,
    issuesWithPRList: IssueWithPR[]
  ): Promise<string>;
  createReleaseNotionPage(botId: Uuid, commitId: string, releaseId: string): Promise<string>;
  createPullRequest(
    gitRepoUrl: string,
    notionPageUrl: string,
    issueNumber: number,
    prNumber: number
  ): Promise<string>;
  getHash(): Promise<string>;
}
