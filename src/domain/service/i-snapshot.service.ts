import { Snapshot } from "../entity/snapshot.entity";

export interface ISnapshotService {
  saveSyncedSnapshot(snapshot: Snapshot);
  compare(analyzedSnapshot: Snapshot);
}