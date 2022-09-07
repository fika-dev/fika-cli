import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const signupAction = async () => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const email = await promptService.askEmailAddress();
  const isValidEmail = await connectService.isAvailableEmail(email);
  if (!isValidEmail) {
    messageService.showInvaildEmail(email);
    return;
  }
  const password = await promptService.askPassword();
  await connectService.requestOtpEmail(email, password);
  const otpToken = await promptService.askOtpToken(email);
  const userWithToken = await connectService.signup(email, password, otpToken);
  configService.updateFikaToken(userWithToken.accessToken);
  return userWithToken.accessToken;
};
