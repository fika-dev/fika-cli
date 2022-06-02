import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { loginAction } from "./login.action";
import { signupAction } from "./signup.action";

export async function authHandler(){
  let token: string;
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  configService.readConfig(require('os').homedir())
  token = configService.getFikaToken();
  if (token){
    connectService.useToken(token);
    return true;
  }else{
    const isSignedUp = await promptService.askAlreadySignedUp();
    if(isSignedUp){
      token = await loginAction();
    }else{
      token = await signupAction();
    }
    connectService.useToken(token);
    return true;
  }
  // test
}