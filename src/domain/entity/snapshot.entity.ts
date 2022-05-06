import { Repo } from "./repo.entity";
import { Component } from "./component.entity";
import { DevObject } from "./dev_object.entity";

export class Snapshot {
  repo?: Repo;
  components: Component[]
  getDevObjects(): DevObject[]{
    if (this.repo){
      return [this.repo].concat(this.components)
    }
    else{
      return this.components;
    }
  }
  
}