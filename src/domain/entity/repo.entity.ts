import { DevObject, ObjectType } from "./dev_object.entity";

export class Repo extends DevObject {
  objectType: ObjectType = ObjectType.Repo;
  repoUrl?: string;
  latestVersion?: string;
  createdDate?: Date;
  authors?: string[];
  commitCount?: number;
  activeDays?: number;
  fileCount?: number;

  needUpdate(devObj: Repo): boolean {
    return (
      devObj.repoUrl === this.repoUrl &&
      devObj.latestVersion === this.latestVersion &&
      devObj.createdDate === this.createdDate &&
      devObj.commitCount === this.commitCount &&
      devObj.activeDays === this.activeDays &&
      devObj.fileCount === this.fileCount &&
      JSON.stringify(devObj.authors.sort()) === JSON.stringify(this.authors.sort())
    );
  }

  static getEmptyRepo(): Repo {
    return new Repo();
  }
}
