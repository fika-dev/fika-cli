import { Snapshot } from "../entity/snapshot.entity";
import { SyncedSnapshot } from "../entity/synced_snapshot.entity";
import { ISnapshotService } from "./i_snapshot.service";

export class SnapshotService implements ISnapshotService{
  private _recentSnapshot: SyncedSnapshot | undefined;
  public saveSyncedSnapshot(snapshot: Snapshot){}
  public compare(analyzedSnapshot: Snapshot){}
}