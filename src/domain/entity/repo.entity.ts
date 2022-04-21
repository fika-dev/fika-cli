import { DevObject } from "./dev_object.entity";

export class Repo extends DevObject{
  repoUrl?: string;
  latestVersion?: string;
  createdDate?: Date;
  authors?: string[];
  commitCount?: number;
  activeDays?: number;
  fileCount?: number;
}

