import { Config } from "src/domain/entity/config.entity";


export const defaultConfig: Config = {
  notionWorkspace: "NOT_CONNECTED",
  addOns: [
    {
      name: "Repo.Analyzer",
      type: "analyzer",
      objectType: "repo",
      databaseName: "Repository Database",
      additionalProperties: [],
    },
    {
      name: "React.Component.Analyzer",
      type: "analyzer",
      objectType: "component",
      databaseName: "React Component Database",
      additionalProperties: [],
    },
    {
      name: "Typescript.Morpher",
      type: "morpher",
    },
  ]
}