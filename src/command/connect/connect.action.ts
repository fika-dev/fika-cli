import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IConnectService } from "@/domain/service/i_connect.service";
import open from 'open';

export const connectAction = async ()=>{
  const connectServic = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const uri = connectServic.getNotionAuthenticationUri();
  await open(uri);
}