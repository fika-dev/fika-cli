import { Config } from "src/domain/entity/config.entity";


export const defaultConfig: Config = {
  notionWorkspace: "NOT_CONNECTED",
  addOns: [
    {
      name: "Repo",
      type: "analyzer",
      databaseName: "Repository Database",
      additionalProperties: [],
    },
    {
      name: "React.Component",
      type: "analyzer",
      databaseName: "React Component Database",
      additionalProperties: [],
    },
  ]
}