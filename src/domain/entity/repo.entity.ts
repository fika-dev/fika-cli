import { DevObject, ObjectType } from "./dev_object.entity";

export class Repo extends DevObject{
  objectType: ObjectType = ObjectType.Repo;
  repoUrl?: string;
  latestVersion?: string;
  createdDate?: Date;
  authors?: string[];
  commitCount?: number;
  activeDays?: number;
  fileCount?: number;

  static getEmptyRepo(): Repo{
    return {
      title: '',
      botId: '',
      objectType: ObjectType.Repo,
    }
  }
}

