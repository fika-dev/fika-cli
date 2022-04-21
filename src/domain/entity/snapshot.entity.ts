import { Repo } from "./repo.entity";
import { Component } from "./component.entity";

export class Snapshot {
  repo: Repo;
  components: Component[]
  lastSyncedDate: Date;
  syncedCommitId: string;
}