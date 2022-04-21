export class Repo {
  id: string;
  title: string;
  url?: string
  latestVersion?: string
  createdDate?: Date
  authors?: string[]
  commitCount?: number
  activeDays?: number
  fileCount?: number
  syncedCommitId?: string
  lastSyncedDate: Date
  createdAt: Date;
  updatedAt: Date;
  botId: string;
}

