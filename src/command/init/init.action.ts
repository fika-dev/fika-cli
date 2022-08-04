import {
  defaultLocalConfig,
  developBranchCandidates,
  mainBranchCandidates,
  releaseBranchCandidates,
} from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";

export const initAction = async () => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const branches = await gitPlatformService.getBranches();
  const foundDevBrances = configService.filterFromCandidates(branches, developBranchCandidates);
  const foundMainBrances = configService.filterFromCandidates(branches, mainBranchCandidates);
  const foundReleaseBrances = configService.filterFromCandidates(branches, releaseBranchCandidates);
  const developBranchName = await promptService.askBranchName(
    "Set develop branch name",
    "develop",
    foundDevBrances
  );
  const mainBranchName = await promptService.askBranchName(
    "Set main branch name",
    "master",
    foundMainBrances
  );
  const releaseBranchName = await promptService.askBranchName(
    "Set release branch name",
    "release",
    foundReleaseBrances
  );
  const initialConfig = defaultLocalConfig;
  initialConfig.branchNames = {
    develop: developBranchName,
    main: mainBranchName,
    release: releaseBranchName,
    issueBranchTemplate: initialConfig.branchNames.issueBranchTemplate,
  };
  configService.createLocalConfig(initialConfig);
};
