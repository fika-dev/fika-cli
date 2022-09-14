import { initFixedBranch } from "@/actions/git/init-fixed-branch.action";
import { initGitRepo } from "@/actions/git/init-git-repo.action";
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
  const branches = gitPlatformService.isGitRepo() ? await gitPlatformService.getBranches() : [];
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
  await initGitRepo();
  await gitPlatformService.checkoutToBranchWithoutReset(mainBranchName);
  const initialConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
  initialConfig.branchNames = {
    develop: developBranchName,
    main: mainBranchName,
    release: releaseBranchName,
    issueBranchTemplate: initialConfig.branchNames.issueBranchTemplate,
  };
  configService.createLocalConfig(initialConfig);
  await gitPlatformService.stageAllChanges();
  await gitPlatformService.commitWithMessage("Add .fikarc for fika configuration");
  await initFixedBranch(mainBranchName);
  await initFixedBranch(releaseBranchName);
  await initFixedBranch(developBranchName);
};
