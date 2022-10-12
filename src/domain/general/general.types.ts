export interface DomainError {
  type: DomainErrorType;
  subType?: DomainErrorSubType;
  value?: any;
}
export type DomainSuccess = {};
export type Unit = "Unit";

type DomainErrorType =
  | "ValidationError"
  | "UserError"
  | "GitError"
  | "BackendError"
  | "UnknownError";

type DomainErrorSubType =
  | ValidationErrorSubType
  | UserErrorSubType
  | GitErrorSubType
  | BackendErrorSubType;
type ValidationErrorSubType =
  | "NotIssueNumberError"
  | "NotHttpAddress"
  | "NotIncludingPattern"
  | "NotBranchName"
  | "NotHttpsGithubAddress"
  | "NotSshGithubAddress"
  | "NotNumberError";

type UserErrorSubType = "UserCancel";
type GitErrorSubType =
  | "GitErrorNoRemoteBranch"
  | "GitErrorFailedToPull"
  | "GitErrorMergeConflict"
  | "NotExistingBranch"
  | "NoCurrentBranch"
  | "NoLocalFeatureBranch"
  | "NoBranchNameInIssueRecord"
  | "ErrorMessageFound"
  | "NotMatchedPullOutput";

type BackendErrorSubType = "IssueRecordNotFound";
