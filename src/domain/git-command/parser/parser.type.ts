export type OutputPatterns = OutputPattern[];

export type OutputPattern = {
  pattern: string;
  value: GitOutputStatus;
};

export type GitOutputStatus = "NO_CHANGE" | "FF_UPDATED" | "CONFLICT" | "MERGED" | "NO_REMOTE";
