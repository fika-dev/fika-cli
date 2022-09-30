import { ghCliVersionCommand, gitVersionCheckCommand } from "../command/command.values";
import {
  getBranchesCmd,
  getCurrentBranchCmd,
  getRemoteBranchesCmd,
  getRemoteOriginCmd,
  statusCmd,
} from "../git-command/git-command.values";
import {
  checkCurrentBranch,
  checkGhCliVersion,
  checkGitVersion,
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
      command: getCurrentBranchCmd,
      parser: checkCurrentBranch,
    },
    localBranches: {
      command: getBranchesCmd,
      parser: parseBranches,
    },
    remoteBranches: {
      command: getRemoteBranchesCmd,
      parser: parseBranches,
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
