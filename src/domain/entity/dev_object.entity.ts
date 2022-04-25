export enum ObjectType {
  Repo,
  Component
}

export class DevObject {
  botId: string;
  objectType: ObjectType;
  id?: string;
  title: string;
  pageUrl?: string;
  syncedCommitId?: string;
  lastSyncedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

