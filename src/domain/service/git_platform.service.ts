import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { exec } from "child_process";
import { inject, injectable } from "inversify";
import { GitHub } from "plug_in/git_platform/git_hub";
import { promisify } from "util";
import { AddOnType } from "../entity/add_on.entity";
import { GitPlatform } from "../entity/git_platform.entity";
import { Issue } from "../entity/issue.entity";
import {
  IGitPlatformService,
  IssueWithPR,
} from "../entity/i_git_platform.service";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { NoGitTag, NO_GIT_TAG } from "../value_object/exceptions/no_git_tag.vo";
import { VersionTag } from "../value_object/version_tag.vo";
import { IConfigService } from "./i_config.service";

@injectable()
export class GitPlatformService implements IGitPlatformService {
  private configService: IConfigService;
  private _gitPlatform: GitPlatform;
  constructor(
    @inject(SERVICE_IDENTIFIER.ConfigService) configService: IConfigService
  ) {
    this.configService = configService;
  }
  async getLatestTag(): Promise<VersionTag> {
    try {
      const execP = promisify(exec);
      const { stdout: tag, stderr: branchNameErr } = await execP(
        "git describe --tags $(git rev-list --tags --max-count=1)"
      );
      return VersionTag.parseVersion(tag);
    } catch (e: any) {
      if ("stderr" in e) {
        const error: string = e.stderr;
        if (error.includes("fatal:")) {
          throw new NoGitTag(NO_GIT_TAG);
        }
      }
      throw e;
    }
  }
  async fetchFromRemote(): Promise<void> {
    const execP = promisify(exec);
    const { stdout: tag, stderr: branchNameErr } = await execP("git fetch");
  }
  async findDifferenceFromMaster(
    branchName: string,
    issueBranchPattern: string
  ): Promise<IssueWithPR[]> {
    const execP = promisify(exec);
    const { stdout: mergedLogs, stderr: branchNameErr } = await execP(
      `git log origin/master..${branchName} --oneline --merges --grep=".*pull request.*"`
    );
    return mergedLogs
      .split("\n")
      .map((log) => this.parseMergedLog(log, issueBranchPattern));
  }
  async getLatestCommitId(branchName: string): Promise<string> {
    const execP = promisify(exec);
    const { stdout: commitId, stderr: branchNameErr } = await execP(
      `git log ${branchName} --format=format:%H -n 1`
    );
    const trimmedCommitId = commitId.trim();
    return trimmedCommitId;
  }
  checkoutToBranch(branchName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  tagCommit(tag: VersionTag): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getGitRepoUrl(): Promise<string> {
    const execP = promisify(exec);
    const { stdout: gitRepoUrlWithGit, stderr: branchNameErr } = await execP(
      "git remote get-url origin"
    );
    return gitRepoUrlWithGit.replace(".git", "").trim();
  }

  async getBranchName(): Promise<string> {
    const execP = promisify(exec);
    const { stdout: branchName, stderr: branchNameErr } = await execP(
      "git rev-parse --abbrev-ref HEAD"
    );
    return branchName;
  }

  async pushBranch(branchName: string): Promise<void> {
    const execP = promisify(exec);
    const { stdout: pushOut, stderr: pushErr } = await execP(
      `git push origin ${branchName}`
    );
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
        this._gitPlatform = new GitHub(config, this.configService);
      }
    }
  }

  async createPR(
    issue: Issue,
    branchName: string,
    baseBranch?: string
  ): Promise<Issue> {
    if (this._gitPlatform) {
      let baseBranchName: string;
      if (!baseBranch) {
        baseBranchName = this.configService.getBaseBranch();
      } else {
        baseBranchName = baseBranch;
      }
      return await this._gitPlatform.createPR(
        issue,
        branchName,
        baseBranchName
      );
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
      throw new Error();
    }
  }
}
