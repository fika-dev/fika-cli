import { AddOnType } from "src/domain/entity/add_on.entity";
import { Config } from "src/domain/entity/config.entity";
import { ObjectType } from "src/domain/entity/dev_object.entity";


export const defaultConfig: Config = {
  notionWorkspace: "NOT_CONNECTED",
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
  ]
}