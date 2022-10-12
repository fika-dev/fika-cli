import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";

export const getFikaIssue = async (gitRepoUrl: string, branchName: string): Promise<Issue> => {
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const issue = await connectService.getIssueRecord(
    configService.parseIssueNumber(branchName),
    gitRepoUrl
  );
  if (issue) {
    return issue;
  } else {
    throw {
      type: "BackendError",
      subType: "IssueRecordNotFound",
      value: {
        issueNumber: configService.parseIssueNumber(branchName),
        gitRepoUrl: gitRepoUrl,
      },
    };
  }
};
