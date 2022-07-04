import "reflect-metadata";
import { Container } from "inversify";
import { ErrorHandlingService } from "@/domain/service/error_handling.service";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { AnalyzeService } from "src/domain/service/analyze.service";
import { ConfigService } from "src/domain/service/config.service";
import { ConnectService } from "src/domain/service/connnect.service";
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
import { IPromptService } from "@/domain/service/i-prompt.service";
import { PromptService } from "@/domain/service/prompt.service";
import { FIKA_PATH } from "./constants/path";



let container = new Container();

container.bind<IAnalyzeService>(SERVICE_IDENTIFIER.AnalyzeService).to(AnalyzeService).inSingletonScope();
container.bind<IConfigService>(SERVICE_IDENTIFIER.ConfigService).to(ConfigService).inSingletonScope();
container.bind<IConnectService>(SERVICE_IDENTIFIER.ConnectService).to(ConnectService).inSingletonScope();
container.bind<IMorphService>(SERVICE_IDENTIFIER.MorphService).to(MorphService).inSingletonScope();
container.bind<IMessageService>(SERVICE_IDENTIFIER.MessageService).to(MessageService).inSingletonScope();
container.bind<ISnapshotService>(SERVICE_IDENTIFIER.SnapshotService).to(SnapshotService).inSingletonScope();
container.bind<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService).to(GitPlatformService).inSingletonScope();
container.bind<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService).to(ErrorHandlingService).inSingletonScope();
container.bind<IPromptService>(SERVICE_IDENTIFIER.PromptService).to(PromptService).inSingletonScope();

if (!process.env.FIKA_ENV){
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue('https://api.fikadev.com');
  const homePath =  require('os').homedir();
  container.bind<string>(PARAMETER_IDENTIFIER.FikaPath).toConstantValue(`${homePath}/${FIKA_PATH}`);
}
else if (process.env.FIKA_ENV === "production"){
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue('https://api.fikadev.com');
  const homePath =  require('os').homedir();
  container.bind<string>(PARAMETER_IDENTIFIER.FikaPath).toConstantValue(`${homePath}/${FIKA_PATH}`);
}else if (process.env.FIKA_ENV === "test"){
  console.log('🧪', ' in IocConfig: ', 'running in test mode!!: ',);
  console.log('🧪', ' in IocConfig: ', 'process.env.FIKA_ENV: ',process.env.FIKA_ENV);
  const apiAddress = 'https://testapi.fikadev.com';
  console.log('🧪', ' in IocConfig: ', 'apiAddress: ',apiAddress);
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue(apiAddress);
  container.bind<string>(PARAMETER_IDENTIFIER.FikaPath).toConstantValue('../test/test-samples');
}else{
  console.log('🧪', ' in IocConfig: ', 'running in develop mode!!: ',);
  console.log('🧪', ' in IocConfig: ', 'process.env.FIKA_ENV: ',process.env.FIKA_ENV);
  const apiAddress = 'http://localhost:3013';
  console.log('🧪', ' in IocConfig: ', 'apiAddress: ',apiAddress);
  container.bind<string>(PARAMETER_IDENTIFIER.Domain).toConstantValue(apiAddress);
  container.bind<string>(PARAMETER_IDENTIFIER.FikaPath).toConstantValue('../test/test-samples');
}


export default container;
