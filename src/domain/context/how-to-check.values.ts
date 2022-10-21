import { ghCliVersionCommand, gitVersionCheckCommand } from "../command/command.values";
import {
  getBranchesCmd,
  getCurrentBranchCmd,
  getRemoteBranchesCmd,
  getRemoteCmd,
  statusCmd,
} from "../git-command/git-command.values";
import {
  checkCurrentBranch,
  checkGhCliVersion,
  checkGitVersion,
  checkHeadParser,
  checkMergeConflict,
  checkStagedChangesParser,
  checkUnstagedChangeParser,
  checkUntrackedFilesParser,
  parseMultipleLines,
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
      command: getRemoteCmd,
      parser: parseMultipleLines,
    },
    currentBranch: {
      command: getCurrentBranchCmd,
      parser: checkCurrentBranch,
    },
    localBranches: {
      command: getBranchesCmd,
      parser: parseMultipleLines,
    },
    remoteBranches: {
      command: getRemoteBranchesCmd,
      parser: parseMultipleLines,
    },
    conflict: {
      command: statusCmd,
      parser: checkMergeConflict,
    },
  },
  cmd: {
    gitVersion: {
      command: gitVersionCheckCommand,
      parser: checkGitVersion,
    },
    ghCliVersion: {
      command: ghCliVersionCommand,
      parser: checkGhCliVersion,
    },
  },
};
