import SERVICE_IDENTIFIER, { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import fs from "fs";
import { exec } from "child_process";
import { inject, injectable } from "inversify";
import { GitHub } from "plug_in/git_platform/git_hub";
import { promisify } from "util";
import { AddOnType } from "../entity/add_on.entity";
import { GitPlatform } from "../entity/git_platform.entity";
import { Issue } from "../entity/issue.entity";
import { IGitPlatformService, IssueWithPR } from "../entity/i_git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { VersionTag } from "../value_object/version_tag.vo";
import { IConfigService } from "./i_config.service";

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
      return true;
    } else {
      return false;
    }
  }
  async pullFrom(branchName: string): Promise<boolean> {
    try {
      const { stdout: pullOutput, stderr: pullError } = await this.execP(
        `git pull --no-ff origin ${branchName}`
      );
      if (pullOutput.includes("Already up to date")) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      if (e.stdout.includes("conflict")) {
        return false;
      } else if (e.stdout.includes("couldn't find remote ref")) {
        return false;
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
    await this.execP(`git stash apply stash^{/${id}}`);
  }
  async getBranches(): Promise<string[]> {
    const { stdout: branchesText, stderr: getBranchesError } = await this.execP(
      `git branch --format='%(refname:short)'`
    );
    return branchesText.split("\n").map(branch => branch.trim());
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
    await this.execP(`git commit -m "${message}"`);
  }
  async stageAllChanges(): Promise<void> {
    await this.execP(`git add .`);
  }

  private async execP(command) {
    const execP = promisify(exec);
    return await execP(`LC_ALL=C  ${command}`, { cwd: this.gitRepoPath });
  }

  async checkoutToBranchWithoutReset(branchName: string): Promise<void> {
    const { stdout: commitId, stderr: branchNameErr } = await this.execP(
      `git checkout ${branchName} 2>/dev/null || git checkout -b ${branchName};`
    );
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
    return branchName.trim();
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
}
