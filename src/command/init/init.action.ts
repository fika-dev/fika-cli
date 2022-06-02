import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";

export const initAction = (homePath: string)=>{
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  configService.createConfig();
}