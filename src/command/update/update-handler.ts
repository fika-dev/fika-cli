import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";

export async function updateHandler(): Promise<boolean> {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const version = configService.getFikaVersion();
  const updateInfo = await connectService.checkUpdate(version);
  if (updateInfo.needUpdate) {
    messageService.showNeedUpdate(updateInfo.recentVersion);
    return true;
  } else if (updateInfo.recommandUpdate) {
    messageService.showRecommendUpdate(updateInfo.recentVersion);
    return false;
  }
  return false;
}
