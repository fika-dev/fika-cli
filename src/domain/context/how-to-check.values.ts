import {
  getCurrentBranch,
  getLocalBranches,
  getRemoteBranches,
  getRemoteOriginCmd,
  statusCmd,
} from "../git-command/git-command.values";
import {
  checkCurrentBranch,
  checkHeadParser,
  checkMergeConflict,
  checkRemoteOrigin,
  checkStagedChangesParser,
  checkUnstagedChangeParser,
  checkUntrackedFilesParser,
  parseBranches,
} from "../git-command/parser/parser.functions";
import { HowToCheck } from "./context.types";

export const howToCheck: HowToCheck = {
  git: {
    head: {
      command: statusCmd,
      parser: checkHeadParser,
    },
    unstagedChanges: {
      command: statusCmd,
      parser: checkUnstagedChangeParser,
    },
    untrackedFiles: {
      command: statusCmd,
      parser: checkUntrackedFilesParser,
    },
    stagedChanges: {
      command: statusCmd,
      parser: checkStagedChangesParser,
    },
    remote: {
      command: getRemoteOriginCmd,
      parser: checkRemoteOrigin,
    },
    currentBranch: {
      command: getCurrentBranch,
      parser: checkCurrentBranch,
    },
    localBranches: {
      command: getLocalBranches,
      parser: parseBranches,
    },
    remoteBranches: {
      command: getRemoteBranches,
      parser: parseBranches,
    },
    conflict: {
      command: statusCmd,
      parser: checkMergeConflict,
    },
  },
  cmd: {},
};
