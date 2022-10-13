import { getGitRepoPath } from "@/domain/git-command/command.functions";
import { ConnectService } from "@/domain/service/connect.service";
import { ErrorHandlingService } from "@/domain/service/error_handling.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { PromptService } from "@/domain/service/prompt.service";
import { CommanderService } from "@/infrastructure/services/implementation/commander.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import dotenv from "dotenv";
import { Container } from "inversify";
import "reflect-metadata";
import { AnalyzeService } from "src/domain/service/analyze.service";
import { ConfigService } from "src/domain/service/config.service";
import { GitPlatformService } from "src/domain/service/git_platform.service";
import { IAnalyzeService } from "src/domain/service/i_analyze.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { IMessageService } from "src/domain/service/i_message.service";
import { IMorphService } from "src/domain/service/i_morph.service";
import { ISnapshotService } from "src/domain/service/i_snapshot.service";
import { MessageService } from "src/domain/service/message.service";
import { MorphService } from "src/domain/service/morph.service";
import { SnapshotService } from "src/domain/service/snapshot.service";
import SERVICE_IDENTIFIER, { PARAMETER_IDENTIFIER } from "./constants/identifiers";
import { FIKA_PATH } from "./constants/path";
import { fikaApiUrl } from "./constants/uri";

dotenv.config();
let container = new Container();

export type GitRepoPathProvider = () => Promise<string>;

container
  .bind<IAnalyzeService>(SERVICE_IDENTIFIER.AnalyzeService)
  .to(AnalyzeService)
  .inSingletonScope();
container
  .bind<IConfigService>(SERVICE_IDENTIFIER.ConfigService)
  .to(ConfigService)
  .inSingletonScope();
container
  .bind<IConnectService>(SERVICE_IDENTIFIER.ConnectService)
  .to(ConnectService)
  .inSingletonScope();
container.bind<IMorphService>(SERVICE_IDENTIFIER.MorphService).to(MorphService).inSingletonScope();
container
  .bind<IMessageService>(SERVICE_IDENTIFIER.MessageService)
  .to(MessageService)
  .inSingletonScope();
container
  .bind<ISnapshotService>(SERVICE_IDENTIFIER.SnapshotService)
  .to(SnapshotService)
  .inSingletonScope();
container
  .bind<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService)
  .to(GitPlatformService)
  .inSingletonScope();
container
  .bind<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService)
  .to(ErrorHandlingService)
  .inSingletonScope();
container
  .bind<IPromptService>(SERVICE_IDENTIFIER.PromptService)
  .to(PromptService)
  .inSingletonScope();
container
  .bind<ICommanderService>(SERVICE_IDENTIFIER.CommanderService)
  .to(CommanderService)
  .inSingletonScope();

if (!process.env.FIKA_ENV) {
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue(fikaApiUrl);
  const homePath = require("os").homedir();
  container.bind<string>(PARAMETER_IDENTIFIER.FikaPath).toConstantValue(`${homePath}/${FIKA_PATH}`);
  container.bind<string>(PARAMETER_IDENTIFIER.ExcutedPath).toConstantValue(process.cwd());
  container
    .bind<GitRepoPathProvider>(PARAMETER_IDENTIFIER.GitRepoPath)
    .toProvider<string>(context => async () => {
      const commanderService = context.container.get<ICommanderService>(
        SERVICE_IDENTIFIER.CommanderService
      );
      return await getGitRepoPath(commanderService.executeGitCommand)();
    });
} else if (process.env.FIKA_ENV === "production") {
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue(fikaApiUrl);
  const homePath = require("os").homedir();
  container.bind<string>(PARAMETER_IDENTIFIER.FikaPath).toConstantValue(`${homePath}/${FIKA_PATH}`);
  container.bind<string>(PARAMETER_IDENTIFIER.ExcutedPath).toConstantValue(process.cwd());
  container
    .bind<GitRepoPathProvider>(PARAMETER_IDENTIFIER.GitRepoPath)
    .toProvider<string>(context => async () => {
      const commanderService = context.container.get<ICommanderService>(
        SERVICE_IDENTIFIER.CommanderService
      );
      return await getGitRepoPath(commanderService.executeGitCommand)();
    });
} else if (process.env.FIKA_ENV === "test") {
  const apiAddress = process.env.TEST_API_ADDRESS;
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue(apiAddress);
  container
    .bind<string>(PARAMETER_IDENTIFIER.ExcutedPath)
    .toConstantValue(process.env.TESTING_REPO_PATH);
  container
    .bind<string>(PARAMETER_IDENTIFIER.FikaPath)
    .toConstantValue(`${process.env.TESTING_PATH}/${FIKA_PATH}`);
  container
    .bind<GitRepoPathProvider>(PARAMETER_IDENTIFIER.GitRepoPath)
    .toProvider<string>(context => async () => {
      const commanderService = context.container.get<ICommanderService>(
        SERVICE_IDENTIFIER.CommanderService
      );
      return await getGitRepoPath(commanderService.executeGitCommand)();
    });
} else {
  const apiAddress = process.env.LOCAL_API_ADDRESS;
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue(apiAddress);
  container
    .bind<string>(PARAMETER_IDENTIFIER.FikaPath)
    .toConstantValue(`${process.env.TESTING_PATH}/${FIKA_PATH}`);
  container
    .bind<string>(PARAMETER_IDENTIFIER.ExcutedPath)
    .toConstantValue(process.env.TESTING_REPO_PATH);
  container
    .bind<GitRepoPathProvider>(PARAMETER_IDENTIFIER.GitRepoPath)
    .toProvider<string>(context => async () => {
      const commanderService = context.container.get<ICommanderService>(
        SERVICE_IDENTIFIER.CommanderService
      );
      return await getGitRepoPath(commanderService.executeGitCommand)();
    });
}

export default container;
