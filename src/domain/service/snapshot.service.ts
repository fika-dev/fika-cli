import path from "path";
import { FIKA_PATH, SNAPSHOT_FILE_NAME } from "src/config/constants/path";
import { Snapshot } from "../entity/snapshot.entity";
import { SyncedSnapshot } from "../entity/synced_snapshot.entity";
import { Difference, ISnapshotService } from "./i_snapshot.service";
import fs from 'fs';
import { DevObject } from "../entity/dev_object.entity";

export class SnapshotService implements ISnapshotService{
  private _recentSnapshot: SyncedSnapshot | undefined;
  private _snapshotFileName: string;

  loadSnapshot(currentPath: string): Snapshot {
    const snapshotFileName = path.join(currentPath, FIKA_PATH, SNAPSHOT_FILE_NAME);
    if (fs.existsSync(snapshotFileName)){
      const snapshotString = fs.readFileSync(snapshotFileName, 'utf-8');
      const snapshot = JSON.parse(snapshotString) as SyncedSnapshot;
      this._recentSnapshot = snapshot;
      return this._recentSnapshot;
    }else{
      return new Snapshot([]);
    }
  }
  
  public saveSyncedSnapshot(snapshot: Snapshot){
    const syncedSnapshot = new SyncedSnapshot(snapshot);
    const snapshotString = JSON.stringify(syncedSnapshot);
    if (this._snapshotFileName){
      fs.writeFileSync(this._snapshotFileName, snapshotString);
    }else{
      throw new Error("Snapshot File Name is Not Saved")
    }
  }
  public compare(analyzedSnapshot: Snapshot): Difference {
    const toBeCreated: DevObject[] = [];
    const toBeRemoved: DevObject[] = [];
    const toBeUpdated: DevObject[] = [];
    const currentObjects = this._recentSnapshot.getDevObjects();
    analyzedSnapshot.getDevObjects().forEach((newObj)=>{
      if (!newObj.id){
        toBeCreated.push(newObj);
      }else{
        const found = currentObjects.find((obj)=>obj.id === newObj.id);
        if (found.needUpdate(newObj)){
          toBeUpdated.push(newObj);
        }
        if (!found){
          toBeRemoved.push(newObj);
        }
      }
    });
    return {
      toBeCreated,
      toBeRemoved,
      toBeUpdated,
    }
  }
}