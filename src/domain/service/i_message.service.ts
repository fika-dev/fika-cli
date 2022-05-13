import { Issue } from "../entity/issue.entity";

export interface IMessageService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showCreateIssueSuccess(issue: Issue): void;
}