import SERVICE_IDENTIFIER, { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import {
  CreateWorkspaceDto,
  CreateWorkspaceDtoType,
} from "@/infrastructure/dto/create_workspace.dto";
import axios, { AxiosError, AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import { CreateIssueDto, CreateIssueDtoType } from "src/infrastructure/dto/create_issue.dto";
import { WorkspaceType } from "../entity/add_on/workspace_platform.entity";
import { DevObject } from "../entity/dev_object.entity";
import { Issue } from "../entity/issue.entity";
import { IssueWithPR } from "./i_git_platform.service";
import { Workspace } from "../entity/workspace.entity";
import { NotionPageNotFound } from "../value_object/exceptions/notion_page_not_found";
import {
  ERROR_CODE_STRING,
  NotOnline,
  SYS_CALL_STRING,
} from "../value_object/exceptions/not_online";
import { WrongPropertyTitleName } from "../value_object/exceptions/wrong_property_title_name";
import { UpdateInfo } from "../value_object/update-info.vo";
import { Uuid } from "../value_object/uuid.vo";
import { VersionTag } from "../value_object/version_tag.vo";
import { IConfigService } from "./i_config.service";
import { IConnectService, UserWithToken } from "./i_connect.service";

interface errorDataType {
  message: string;
  statusCode: number;
}
@injectable()
export class ConnectService implements IConnectService {
  private token: string | undefined;
  private domain: string;
  private axiosInstance: AxiosInstance;
  private configService: IConfigService;
  constructor(
    @inject(PARAMETER_IDENTIFIER.Domain) domain: string,
    @inject(SERVICE_IDENTIFIER.ConfigService) configService: IConfigService
  ) {
    this.domain = domain;
    this.configService = configService;
    this.axiosInstance = axios.create({
      baseURL: this.domain,
      timeout: 10000,
    });
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: any) => {
        if (error.syscall === SYS_CALL_STRING && error.code === ERROR_CODE_STRING) {
          throw new NotOnline("NotOnline");
        } else {
          throw error;
        }
      }
    );
  }
  async getHash(): Promise<string> {
    const response = await this.axiosInstance.get("/auth/hash", {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error("couldnt get hash");
    }
  }
  async deleteIssueRecord(gitRepoUrl: string, issueNumber: number): Promise<void> {
    try {
      const response = await this.axiosInstance.delete("/git/issue", {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data: {
          gitRepoUrl: gitRepoUrl,
          issueNumber: issueNumber,
        },
      });
      return response.data.id;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  async getIssueRecordByPage(issueUrl: string, gitRepoUrl: string): Promise<Issue> {
    try {
      const response = await this.axiosInstance.get(
        `/git/issue?gitRepoUrl=${gitRepoUrl}&notionPageUrl=${issueUrl}`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.data) {
        return {
          issueUrl: response.data.notionPageUrl,
          title: response.data.title,
          gitIssueUrl: `${gitRepoUrl}/issues/${response.data.issueNumber}`,
          branchName: response.data.branchName,
          labels: [],
        };
      } else {
        return;
      }
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log(
        "🧪",
        " in ConnnectService: ",
        " in getIssueRecordByPage: ",
        "error code: ",
        axiosError.code
      );
      throw new Error(axiosError.message);
    }
  }
  async createPullRequestRecord(
    gitRepoUrl: string,
    notionPageUrl: string,
    issueNumber: number,
    prNumber: number
  ): Promise<string> {
    try {
      const response = await this.axiosInstance.post(
        "/git/pull-request",
        {
          gitRepoUrl: gitRepoUrl,
          notionPageUrl: notionPageUrl,
          issueNumber: issueNumber,
          prNumber: prNumber,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data.id;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  async createReleaseRecord(
    gitRepoUrl: string,
    tag: VersionTag,
    issuesWithPRList: IssueWithPR[]
  ): Promise<string> {
    try {
      const response = await this.axiosInstance.post(
        "/git/release",
        {
          gitRepoUrl: gitRepoUrl,
          tag: tag.verionString,
          issuesWithPR: issuesWithPRList,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data.id;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  async createReleaseNotionPage(botId: Uuid, commitId: string, releaseId: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post(
        "/notion/release",
        {
          botId: botId.asString(),
          commitId: commitId,
          releaseId: releaseId,
        },
        { headers: { "content-type": "application/json" } }
      );
      return response.data;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  async createIssueRecord(issue: Issue): Promise<void> {
    try {
      const fragments = issue.gitIssueUrl.split("/");
      const gitRepoUrl = fragments.slice(0, fragments.length - 2).join("/");
      const createIssueRecordDto: CreateIssueRecord = {
        gitRepoUrl: gitRepoUrl,
        notionPageUrl: issue.issueUrl,
        title: issue.title,
        issueNumber: fragments[fragments.length - 1],
        branchName: issue.branchName,
      };
      const response = await this.axiosInstance.post("/git/issue", createIssueRecordDto, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log(
        "🧪",
        " in ConnnectService: ",
        " in createIssueRecord: ",
        "error code: ",
        axiosError.code
      );
      throw new Error(axiosError.message);
    }
  }
  async getIssueRecord(issueNumber: number, gitRepoUrl: string): Promise<Issue> {
    let cleanGitRepoUrl: string;
    if (gitRepoUrl.endsWith(".git")) {
      cleanGitRepoUrl = gitRepoUrl.slice(undefined, gitRepoUrl.length - 4);
    } else {
      cleanGitRepoUrl = gitRepoUrl;
    }
    try {
      const response = await this.axiosInstance.get(
        `/git/issue?gitRepoUrl=${cleanGitRepoUrl}&issueNumber=${issueNumber}`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return {
        issueUrl: response.data.notionPageUrl,
        title: response.data.title,
        gitIssueUrl: `${gitRepoUrl}/issues/${response.data.issueNumber}`,
        labels: [],
        gitPrUrl: response.data.prUrl,
        branchName: response.data.branchName,
      };
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log(
        "🧪",
        " in ConnnectService: in getIssueRecord: ",
        "error code: ",
        axiosError.code
      );
      throw new Error(axiosError.message);
    }
  }

  async checkUpdate(currentVersion: string): Promise<UpdateInfo> {
    try {
      const response = await this.axiosInstance.get(
        `/cli/version?current-version=${currentVersion}`
      );
      const updateInfo = response.data as UpdateInfo;
      return updateInfo;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  useToken(token: string): void {
    this.token = token;
  }

  async isAvailableEmail(email: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/auth/is-valid-email`,
        { email },
        { headers: { "content-type": "application/json" } }
      );
      return true;
    } catch (e) {
      const axiosError = e as AxiosError;
      const responseData = axiosError.response.data as any;
      if (responseData && responseData.statusCode === 409) {
        return false;
      }
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.response.data);
      throw new Error(axiosError.message);
    }
  }

  async requestOtpEmail(email: string, password: string): Promise<void> {
    try {
      const response = await this.axiosInstance.post(
        `/auth/send-otp-email`,
        { email, password },
        { headers: { "content-type": "application/json" } }
      );
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async signup(email: string, password: string, otpToken: string): Promise<UserWithToken> {
    try {
      const response = await this.axiosInstance.post(
        `/auth/cli/signup`,
        { email, password, otpToken },
        { headers: { "content-type": "application/json" } }
      );
      return { accessToken: response.data.token.access_token };
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async signin(email: string, password: string): Promise<UserWithToken> {
    try {
      const response = await this.axiosInstance.post(
        `/auth/cli/signin`,
        { email, password },
        { headers: { "content-type": "application/json" } }
      );
      return { accessToken: response.data.token.access_token };
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log("🧪", " in ConnnectService: ", "error code: ", axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async getWorkspaceIssue(
    documentUrl: string,
    workpaceId: Uuid,
    workspaceType: WorkspaceType
  ): Promise<Issue> {
    try {
      const response = await this.axiosInstance.get(
        `/workspace/issue?workspaceId=${workpaceId.asString()}&documentUrl=${documentUrl}&workspaceType=${workspaceType}`
      );
      const dto = new CreateIssueDto(response.data as CreateIssueDtoType);
      return dto.toEntity();
    } catch (e) {
      const axiosError = e as AxiosError;
      if (axiosError?.response?.data) {
        const errorData = axiosError.response.data as errorDataType;
        if (errorData.message === "WRONG_PROPERTY_TITLE_NAME") {
          throw new WrongPropertyTitleName("WRONG_PROPERTY_TITLE_NAME");
        }
        if (errorData.message === "NotFoundBlock") {
          throw new NotionPageNotFound("NotionPageNotFound");
        }
        console.log(
          "🧪",
          " in ConnnectService: ",
          " in getWorkspaceIssue: ",
          "error code: ",
          axiosError.code
        );
        throw new Error(axiosError.message);
      } else {
        throw new Error(e);
      }
    }
  }
  async updateWorkspaceIssue(
    updatedIssue: Issue,
    workspaceId: Uuid,
    workspaceType: WorkspaceType
  ): Promise<Issue> {
    try {
      const response = await this.axiosInstance.patch(
        `/workspace/issue`,
        {
          ...updatedIssue,
          workspaceId: workspaceId.asString(),
          workspaceType,
        },
        { headers: { "content-type": "application/json" } }
      );
      return updatedIssue;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.log(
        "🧪",
        " in ConnnectService: ",
        " in updateIssue:",
        "error code: ",
        axiosError.code
      );
      throw new Error(axiosError.message);
    }
  }

  async requestWorkspace(workspaceType: WorkspaceType, workspaceId: Uuid): Promise<Workspace> {
    try {
      const response = await this.axiosInstance.get(
        `/workspace/${workspaceType}/${workspaceId.asString()}`
      );
      const dto = new CreateWorkspaceDto(response.data as CreateWorkspaceDtoType);
      return dto.toEntity();
    } catch (e) {
      if (e.response?.data) {
        console.log("🧪", " in ConnnectService: ", "error code: ", e.response.data);
        throw new Error(`${e.response.data.error}: ${e.response.data.message}`);
      } else {
        throw new Error(e);
      }
    }
  }
}
