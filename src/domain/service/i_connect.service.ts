import { WorkspaceType } from "../entity/add_on/workspace_platform.entity";
import { DevObject } from "../entity/dev_object.entity";
import { Issue } from "../entity/issue.entity";
import { IssueWithPR } from "./i_git_platform.service";
import { Workspace } from "../entity/workspace.entity";
import { UpdateInfo } from "../value_object/update-info.vo";
import { Uuid } from "../value_object/uuid.vo";
import { VersionTag } from "../value_object/version_tag.vo";

export interface UserWithToken {
  accessToken: string;
}

export interface IConnectService {
  getHash(): Promise<string>;
  requestWorkspace(workspaceType: WorkspaceType, workspaceId: Uuid): Promise<Workspace>;
  useToken(token: string): void;

  getWorkspaceIssue(
    documentUrl: string,
    workspaceId: Uuid,
    workspaceType: WorkspaceType
  ): Promise<Issue>;
  updateWorkspaceIssue(
    updatedIssue: Issue,
    workspaceId: Uuid,
    workspaceType: WorkspaceType
  ): Promise<Issue>;

  createIssueRecord(issue: Issue): Promise<void>;
  getIssueRecord(issueNumber: number, gitRepoUrl: string): Promise<Issue>;
  getIssueRecordByPage(issueUrl: string, gitRepoUrl: string): Promise<Issue>;
  deleteIssueRecord(gitRepoUrl: string, issueNumber: number): Promise<void>;

  isAvailableEmail(email: string): Promise<boolean>;
  requestOtpEmail(email: string, password: string): Promise<void>;
  signup(email: string, password: string, otpToken: string): Promise<UserWithToken>;
  signin(email: string, password: string): Promise<UserWithToken>;
  checkUpdate(currentVersion: string): Promise<UpdateInfo>;

  createReleaseRecord(
    gitRepoUrl: string,
    tag: VersionTag,
    issuesWithPRList: IssueWithPR[]
  ): Promise<string>;
  createReleaseNotionPage(botId: Uuid, commitId: string, releaseId: string): Promise<string>;
  createPullRequestRecord(
    gitRepoUrl: string,
    notionPageUrl: string,
    issueNumber: number,
    prNumber: number
  ): Promise<string>;
}
