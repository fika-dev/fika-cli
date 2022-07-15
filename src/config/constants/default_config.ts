import { LocalConfig } from "@/domain/service/i_config.service";
import { AddOnType } from "src/domain/entity/add_on.entity";
import { Config } from "src/domain/entity/config.entity";
import { ObjectType } from "src/domain/entity/dev_object.entity";

export const defaultConfig: Config = {
  notionWorkspace: "NOT_CONNECTED",
  fikaToken: "UN_AUTHENTICATED",
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
    baseBranch: "develop",
    issueBranchTemplate: "feature/iss/#<ISSUE_NUMBER>",
  },
};

export const defaultLocalConfig: LocalConfig = {
  branchNames: {
    develop: "develop",
    main: "master",
    release: "release",
  },
  start: {
    fromDevelopOnly: true,
    pullBeforeAlways: true,
    checkoutToFeature: true,
  },
  finish: {
    checkOutToDevelop: false,
  },
};

export const developBranchCandidates: string[] = ["develop", "dev"];

export const mainBranchCandidates: string[] = ["main", "master", "production"];

export const releaseBranchCandidates: string[] = ["release", "test", "staging"];
