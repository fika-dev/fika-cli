import { ghCliVersionCommand, gitVersionCheckCommand } from "../command/command.values";
import * as command from "../git-command/command.functions";
import { GitCommand } from "../git-command/command.types";
import {
  getCurrentBranchCmd,
  getLocalBranchesCmd,
  getRemoteBranchesCmd,
  getRemoteOriginCmd,
  getRemoteUrlCmd,
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
      command: getLocalBranchesCmd,
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
