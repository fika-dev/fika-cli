import { DevObject } from "./dev_object.entity";
import { Snapshot } from "./snapshot.entity";

export class SyncedSnapshot extends Snapshot {
  lastSyncedDate: Date;

  constructor(snapshot: Snapshot) {
    super(snapshot.getDevObjects());
    this.lastSyncedDate = new Date(Date.now());
  }
}
