import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const connectAction = ()=>{
  const connectServic = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  connectServic.guideNotionAuthentication();
}