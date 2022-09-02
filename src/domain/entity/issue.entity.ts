export class Issue {
  gitIssueUrl?: string;
  notionUrl: string;
  title: string;
  body?: string;
  labels: string[];
  prUrl?: string;
  static parseNumberFromUrl(prUrl: string): number {
    const fragments = prUrl.trim().split("/");
    return parseInt(fragments[fragments.length - 1]);
  }
}
