import { IPromptService } from "@/domain/service/i-prompt.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const loginAction = async ()=>{
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const email = await promptService.askEmailAddress();
  const password = await promptService.askPassword();
  const userWithToken = await connectService.signin(email, password);;
  configService.updateFikaToken(userWithToken.accessToken);
  return userWithToken.accessToken;
}