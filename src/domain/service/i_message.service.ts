import { Issue } from "../entity/issue.entity";

export interface ErrorMessage {
  code: string,
  message: string,
  guideUrl?: string,
}
export interface IMessageService {
  showSuccess(message: string): void;
  showError(message: ErrorMessage): void;
  showCreateIssueSuccess(issue: Issue): void;
  showCreatePRSuccess(issue: Issue): void;
  showConnecting(connectingUrl: string): void;
  showConnectSuccess(): void;
  showGettingIssue(): void;
  showCreatingGitIssue(): void;
  showGettingIssueForPR(): void;
  showGitPush(branchName: string): void;
  showCreatingPR(issue: Issue, branchName: string): void;
  showInvaildEmail(email: string): void;
}