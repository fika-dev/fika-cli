import { Snapshot } from "./snapshot.entity";

export class SyncedSnapshot extends Snapshot{
  lastSyncedDate: Date;
  syncedCommitId: string;
}