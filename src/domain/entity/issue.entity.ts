export class Issue {
  gitIssueUrl?: string;
  issueUrl: string;
  title: string;
  body?: string;
  labels: string[];
  gitPrUrl?: string;
  branchName?: string;
  static parseNumberFromUrl(prUrl: string): number {
    const fragments = prUrl.trim().split("/");
    return parseInt(fragments[fragments.length - 1]);
  }
}
