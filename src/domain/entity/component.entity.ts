
export class NotionDevElement {
  id: string;
  type: string;
  tags?: string[];

  title: string;
  filePath: string;
  description?: string;
  methods?: string[];
  props?: string[];

  lastSyncedDate: Date;
  createdAt: Date;
  updatedAt: Date;

  botId: string;
  repoId: string;
}

