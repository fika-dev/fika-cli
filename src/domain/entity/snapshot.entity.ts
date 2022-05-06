import { Repo } from "./repo.entity";
import { Component } from "./component.entity";
import { DevObject, ObjectType } from "./dev_object.entity";

export class Snapshot {
  repo?: Repo;
  components: Component[]
  constructor(devObjects: DevObject[]){
    devObjects.forEach((debObj)=> {
      if(debObj.objectType === ObjectType.Repo){
        this.repo = debObj as Repo;
      }else{
        this.components.push(debObj);
      }
    });
  }
  getDevObjects(): DevObject[]{
    if (this.repo){
      return [this.repo].concat(this.components)
    }
    else{
      return this.components;
    }
  }
}