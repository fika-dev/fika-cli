import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { GitPlatform } from "@/domain/entity/add_on/git_platform.entity";
import { Issue } from "@/domain/entity/issue.entity";

export const createGitPlatformIssue = async (issue: Issue): Promise<Issue> => {
  const gitPlatform = container.get<GitPlatform>(SERVICE_IDENTIFIER.GitPlatform);
  const updatedIssue = await gitPlatform.createIssue(issue);
  return updatedIssue;
};
