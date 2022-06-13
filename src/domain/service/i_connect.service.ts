import { DevObject } from "../entity/dev_object.entity";
import { Issue } from "../entity/issue.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { NotionUrl } from "../value_object/notion_url.vo";
import { UpdateInfo } from "../value_object/update-info.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface UserWithToken {
  accessToken: string
}
export interface IConnectService {
  getNotionAuthenticationUri(): string;
  requestNotionWorkspace(botId: Uuid): Promise<NotionWorkspace>;
  create(devObj: DevObject): Promise<string>;
  update(devObj: DevObject): Promise<string>;
  remove(devObj: DevObject): Promise<string>;
  getIssue(documentUrl: NotionUrl, botId: Uuid) : Promise<Issue>;
  updateIssue(updatedIssue: Issue, botId: Uuid): Promise<Issue>;
  useToken(token: string): void;
  isAvailableEmail(email: string): Promise<boolean>
  requestOtpEmail(email: string, password: string): Promise<void>
  signup(email: string, password: string, otpToken: string): Promise<UserWithToken>
  signin(email: string, password: string): Promise<UserWithToken>
  checkUpdate(currentVersion: string): Promise<UpdateInfo>

  createIssueRecord(issue: Issue): Promise<void>;
  getIssueRecord(branchName: string): Promise<Issue>;
}