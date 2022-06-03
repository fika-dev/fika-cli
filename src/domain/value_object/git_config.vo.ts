export class GitConfig{
  baseBranch: string;
  issueBranchTemplate: string;
  static validateIssueBranch = (issueBranchTemplate: string)=>{
    return issueBranchTemplate.includes(GitConfig.issueNumberTag)
  }
  static getIssueBranch = (issueNumber: string, issueBranchTemplate: string)=>{
    return issueBranchTemplate.replace(GitConfig.issueNumberTag, issueNumber);
  }
  static issueNumberTag: string = '<ISSUE_NUMBER>';
}