import { AddOnType } from "src/domain/entity/add_on.entity";
import { Config } from "src/domain/entity/config.entity";
import { ObjectType } from "src/domain/entity/dev_object.entity";

export const TEST_FIKA_BOT_ID = 'd3224eba-6e67-4730-9b6f-a9ef1dc7e4ac';

export const TEST_TASK_DOC_ID = 'https://www.notion.so/test-document-8d3ec82f2fc14b64b150f298c48598ae';

export const testUserConfig: Config = {
  notionWorkspace: {
    "id": "6e9f6c0d-9018-43cf-8081-9ddb21368fc2",
    "botId": "d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac",
    "name": "원모's Notion",
    "icon": "https://s3-us-west-2.amazonaws.com/public.notion-static.com/11ee3c37-db45-447b-855a-6df75df2bf32/notion_fika_logo.png",
    "owner": {
      workspace: true,
    }
  },
  fikaToken: {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiIwMGZlMzFmMC1lZmE2LTRiZDMtYjU4MS1mNGVmZWMwOTA3ZTkiLCJpYXQiOjE2NTcwNzMwMjR9.6KWxLb87PDbnbB0cI9QZXaJ51Xuf8j1uKnuoWuEhxhc"
  },
  addOns: [
    {
      name: "Repo.Analyzer",
      type: AddOnType.Analyzer,
      objectType: ObjectType.Repo,
      databaseName: "Repository Database",
      additionalProperties: [],
    },
    {
      name: "React.Component.Analyzer",
      type: AddOnType.Analyzer,
      objectType: ObjectType.Component,
      databaseName: "React Component Database",
      additionalProperties: [],
    },
    {
      name: "Typescript.Morpher",
      type: AddOnType.Morpher,
    },
    {
      name: "Github.GitPlatform",
      type: AddOnType.GitPlatform,
    },
  ],
  git: {
    baseBranch: 'develop',
    issueBranchTemplate: 'feature/iss/#<ISSUE_NUMBER>',
  }
}