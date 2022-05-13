import { DevObject } from "../entity/dev_object.entity";
import { Snapshot } from "../entity/snapshot.entity";

export interface Difference {
  toBeCreated: DevObject[],
  toBeUpdated: DevObject[],
  toBeRemoved: DevObject[],
}

export interface ISnapshotService {
  loadSnapshot(homePath: string): Snapshot;
  saveSyncedSnapshot(snapshot: Snapshot);
  compare(analyzedSnapshot: Snapshot): Difference;
}