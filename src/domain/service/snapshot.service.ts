import { Snapshot } from "../entity/snapshot.entity";
import { SyncedSnapshot } from "../entity/synced-snapshot.entity";
import { ISnapshotService } from "./i-snapshot.service";

export class SnapshotService implements ISnapshotService{
  private _recentSnapshot: SyncedSnapshot | undefined;
  public saveSyncedSnapshot(snapshot: Snapshot){}
  public compare(analyzedSnapshot: Snapshot){}
}