import { LocalConfig } from "@/domain/service/i_config.service";
import { AddOnType } from "@/domain/entity/add_on/add_on.entity";
import { Config } from "src/domain/entity/config.entity";
import { ObjectType } from "src/domain/entity/dev_object.entity";

export const issueNumberTag = "<ISSUE_NUMBER>";

export const defaultConfig: Config = {
  workspaces: "NOT_CONNECTED",
  fikaToken: "UN_AUTHENTICATED",
  currentWorkspaceId: "NOT_CONNECTED",
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
};

export const defaultLocalConfig: LocalConfig = {
  branchNames: {
    develop: "main",
    main: "main",
    release: "main",
    issueBranchTemplate: `feature/iss/#${issueNumberTag}`,
  },
  start: {
    fromDevelopOnly: true,
    pullBeforeAlways: true,
    checkoutToFeature: true,
  },
  finish: {
    checkOutToDevelop: false,
    checkMergeConflict: true,
  },
  git: {
    remoteAlias: "origin",
  },
};

export const developBranchCandidates: string[] = ["develop", "dev", "main", "master"];

export const mainBranchCandidates: string[] = ["main", "master", "production"];

export const releaseBranchCandidates: string[] = ["release", "test", "staging", "main", "master"];
