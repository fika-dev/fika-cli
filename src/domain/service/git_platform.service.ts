import SERVICE_IDENTIFIER, { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import { exec } from "child_process";
import fs from "fs";
import { inject, injectable } from "inversify";
import { GitHub } from "plug_in/git_platform/git_hub";
import { promisify } from "util";
import { AddOnType } from "../entity/add_on/add_on.entity";
import { GitPlatform } from "../entity/add_on/git_platform.entity";
import { Issue } from "../entity/issue.entity";
import { IGitPlatformService, IssueWithPR } from "../entity/i_git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { NothingToCommit } from "../value_object/exceptions/nothing_to_commit";
import { NoRemoteBranch } from "../value_object/exceptions/no_remote_branch";
import { VersionTag } from "../value_object/version_tag.vo";
import { IConfigService } from "./i_config.service";

export type GitStatus = "UPDATED" | "REMOTE_CONFLICT" | "NO_CHANGE" | "NO_REMOTE_BRANCH";

@injectable()
export class GitPlatformService implements IGitPlatformService {
  private configService: IConfigService;
  private gitRepoPath: string;
  private _gitPlatform: GitPlatform;
  constructor(
    @inject(SERVICE_IDENTIFIER.ConfigService) configService: IConfigService,
    @inject(PARAMETER_IDENTIFIER.GitRepoPath) gitRepoPath: string
  ) {
    this.configService = configService;
    this.gitRepoPath = gitRepoPath;
  }
  isGitRepo(): boolean {
    return fs.existsSync(`${this.gitRepoPath}/.git`);
  }

  async abortMerge(): Promise<void> {
    await this.execP("git merge --abort");
  }
  async checkConflict(): Promise<boolean> {
    const { stdout: statusOutput, stderr: diffError } = await this.execP("git status");
    if (statusOutput.includes("git merge --abort")) {
      await this.abortMerge();
      return true;
    } else {
      return false;
    }
  }
  async pullFrom(branchName: string): Promise<GitStatus> {
    try {
      const { stdout: pullOutput, stderr: pullError } = await this.execP(
        `git pull --no-ff origin ${branchName}`
      );
      if (pullOutput.includes("Already up to date")) {
        return "NO_CHANGE";
      } else {
        return "UPDATED";
      }
    } catch (e) {
      if (e.stdout.includes("conflict")) {
        return "REMOTE_CONFLICT";
      } else if (e.stdout.includes("couldn't find remote ref")) {
        return "NO_REMOTE_BRANCH";
      } else {
        throw e;
      }
    }
  }
  async checkUnstagedChanges(): Promise<boolean> {
    const { stdout: changes, stderr: diffError } = await this.execP(
      `git --no-pager diff --name-only`
    );
    if (changes.trim().length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async stash(id: string): Promise<void> {
    await this.execP(`git stash push -u -m "${id}"`);
  }
  async applyStash(id: string): Promise<void> {
    let command: string;
    if (process.platform == "win32") {
      command = `git stash apply stash^^{/${id}}`;
    } else {
      command = `git stash apply stash^{/${id}}`;
    }
    await this.execP(command);
  }
  async getBranches(): Promise<string[]> {
    const { stdout: branchesText, stderr: getBranchesError } = await this.execP(
      `git branch --format='%(refname:short)'`
    );
    return branchesText.split("\n").map(branch => branch.trim().replace("'", "").replace("'", ""));
  }
  async getLatestBranchByCommitDate(): Promise<string> {
    const localConfig = this.configService.getLocalConfig();
    const template = localConfig.branchNames.issueBranchTemplate;
    const branches = await this.getSortedBranchesByCommitDate();
    const filteredList = branches.filter(branch => this.isItAFeatureBranch(branch, template));
    return filteredList.length > 0 ? filteredList[0] : undefined;
  }
  async getSortedBranchesByCommitDate(): Promise<string[]> {
    const { stdout: branchesText, stderr: getBranchesError } = await this.execP(
      "git branch --sort=-committerdate --format='%(refname:short)'"
    );
    return branchesText
      .trim()
      .split("\n")
      .map(branch => branch.trim());
  }
  async deleteLocalBranch(branchName: string): Promise<void> {
    await this.execP(`git branch -D "${branchName}"`);
  }
  async deleteRemoteBranch(branchName: string): Promise<void> {
    await this.execP(`git push origin --delete "${branchName}"`);
  }
  async commitWithMessage(message: string): Promise<void> {
    try {
      const { stdout: commitText, stderr: commitError } = await this.execP(
        `git commit -m "${message}"`
      );
    } catch (e) {
      if (e.stdout.includes("nothing to commit")) {
        throw new NothingToCommit("NothingToCommit");
      } else {
        throw e;
      }
    }
  }
  async stageAllChanges(): Promise<void> {
    await this.execP(`git add .`);
  }
  async createDummyChange(): Promise<void> {
    await this.execP('echo "Dummy change" >> README.md');
  }
  private async execP(command) {
    const execP = promisify(exec);
    if (process.platform == "win32") {
      return await execP(`${command}`, { cwd: this.gitRepoPath });
    } else {
      return await execP(`LC_ALL=C  ${command}`, { cwd: this.gitRepoPath });
    }
  }
  async checkoutToBranchWithoutReset(branchName: string): Promise<void> {
    let command: string;
    if (process.platform === "win32") {
      command = `git checkout ${branchName} >nul 2>nul ||  git checkout -b ${branchName}`;
    } else {
      command = `git checkout ${branchName} 2>/dev/null || git checkout -b ${branchName}`;
    }
    await this.execP(command);
  }
  async checkoutToFeatureBranch(branchName: string): Promise<void> {
    await this.execP("git fetch");
    try {
      let command: string;
      if (process.platform === "win32") {
        const winName = branchName.trim().replace("'", "").replace("'", "");
        command = `git checkout ${winName} >nul 2>nul ||  git checkout -b ${winName} --track origin/${winName}`;
      } else {
        command = `git checkout ${branchName} 2>/dev/null || git checkout -b ${branchName} --track origin/${branchName}`;
      }
      await this.execP(command);
    } catch (e) {
      if (
        e.stdout.includes(`is not a commit and a branch ${branchName} cannot be created from it`)
      ) {
        throw new NoRemoteBranch("NoRemoteBranch");
      } else {
        throw e;
      }
    }
  }
  async getLatestTag(): Promise<VersionTag> {
    try {
      const { stdout: tag, stderr: branchNameErr } = await this.execP(
        "git describe --tags $(git rev-list --tags --max-count=1)"
      );
      return VersionTag.parseVersion(tag);
    } catch (e: any) {
      if ("stderr" in e) {
        const error: string = e.stderr;
        if (error.includes("fatal:")) {
          return undefined;
        }
      }
      throw e;
    }
  }
  async fetchFromRemote(): Promise<void> {
    const { stdout: tag, stderr: branchNameErr } = await this.execP("git fetch");
  }
  async findDifferenceFromMaster(
    branchName: string,
    issueBranchPattern: string
  ): Promise<IssueWithPR[]> {
    const { stdout: mergedLogs, stderr: branchNameErr } = await this.execP(
      `git log origin/master..${branchName} --oneline --merges --grep=".*pull request.*"`
    );
    return mergedLogs
      .trim()
      .split("\n")
      .map(log => this.parseMergedLog(log, issueBranchPattern));
  }
  async getLatestCommitId(branchName: string): Promise<string> {
    const { stdout: commitId, stderr: branchNameErr } = await this.execP(
      `git log ${branchName} --format=format:%H -n 1`
    );
    const trimmedCommitId = commitId.trim();
    return trimmedCommitId;
  }
  async checkoutToBranchWithReset(branchName: string): Promise<void> {
    const { stdout: commitId, stderr: branchNameErr } = await this.execP(
      `git checkout -B ${branchName}`
    );
  }
  async tagCommit(branchName: string, tag: VersionTag): Promise<void> {
    const { stdout: commitId, stderr: branchNameErr } = await this.execP(
      `git tag -a ${tag.verionString} -m "${branchName} version ${tag.verionString}\ngenerated by fika";`
    );
  }
  async getGitRepoUrl(): Promise<string> {
    const { stdout: gitRepoUrlWithGit, stderr: branchNameErr } = await this.execP(
      "git remote get-url origin"
    );
    return gitRepoUrlWithGit.replace(".git", "").trim();
  }

  async getBranchName(): Promise<string> {
    const { stdout: branchName, stderr: branchNameErr } = await this.execP(
      "git rev-parse --abbrev-ref HEAD"
    );
    return branchName.trim().replace("'", "").replace("'", "");
  }

  async pushBranch(branchName: string): Promise<void> {
    const { stdout: pushOut, stderr: pushErr } = await this.execP(`git push origin ${branchName}`);
  }

  async createIssue(issue: Issue): Promise<Issue> {
    if (this._gitPlatform) {
      return await this._gitPlatform.createIssue(issue);
    } else {
      throw new Error("Git Platform is not defined, need to config first");
    }
  }
  configGitPlatform(config: AddOnConfig) {
    if (config.type === AddOnType.GitPlatform) {
      if (config.name === "Github.GitPlatform") {
        this._gitPlatform = new GitHub(config, this.configService, this.gitRepoPath);
      }
    }
  }

  async createPR(issue: Issue, branchName: string, baseBranch?: string): Promise<Issue> {
    if (this._gitPlatform) {
      let baseBranchName: string;
      if (!baseBranch) {
        baseBranchName = this.configService.getBaseBranch();
      } else {
        baseBranchName = baseBranch;
      }
      return await this._gitPlatform.createPR(issue, branchName, baseBranchName);
    } else {
      throw new Error("Git Platform is not defined, need to config first");
    }
  }

  private parseMergedLog(log: string, issueBranchPattern: string) {
    const pt1 = issueBranchPattern.replace("<ISSUE_NUMBER>", "(\\d{1,6})");
    const re = new RegExp("/", "g");
    const pt2 = pt1.replace(re, "\\/");
    const pt3 = "Merge pull request #(\\d{1,6}) from .*" + pt2;
    const mergedLogPattern = new RegExp(pt3, "g");
    const matched = mergedLogPattern.exec(log);
    if (matched) {
      return {
        prNumber: parseInt(matched[1]),
        issueNumber: parseInt(matched[2]),
      };
    } else {
      return this.parseMergedLogOnlyPR(log);
    }
  }

  private parseMergedLogOnlyPR(log: string) {
    const pt = "Merge pull request #(\\d{1,6}) from .*";
    const mergedLogPattern = new RegExp(pt, "g");
    const matched = mergedLogPattern.exec(log);
    if (matched) {
      return {
        prNumber: parseInt(matched[1]),
        issueNumber: undefined,
      };
    } else {
      throw new Error(`can not parse \n${log}`);
    }
  }

  private isItAFeatureBranch(log: string, issueBranchPattern: string) {
    const pt = issueBranchPattern.replace("<ISSUE_NUMBER>", "(\\d{1,6})");
    const re = new RegExp(pt);
    return re.test(log);
  }
  async gitInit(): Promise<void> {
    await this.execP(`git init .`);
  }
  async isThereRemoteUrl(): Promise<boolean> {
    try {
      const { stdout: remoteResp, stderr: remoteErr } = await this.execP(
        "git remote get-url origin"
      );
      return remoteResp.trim().length > 0;
    } catch (e) {
      if (e.stderr.includes("No such remote")) {
        return false;
      } else {
        throw e;
      }
    }
  }
  async removeRemoteUrl(): Promise<void> {
    await this.execP("git remote remove origin");
  }
  async setRemoteUrl(remoteUrl: string): Promise<void> {
    await this.execP(`git remote add origin ${remoteUrl}`);
  }
}
