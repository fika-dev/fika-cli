import { WorkspaceType } from "@/domain/entity/add_on/workspace_platform.entity";
import { IMessageService } from "@/domain/service/i_message.service";
import { Uuid } from "@/domain/value_object/uuid.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const setAction = async (workspaceTypeAndId: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const [workspaceType, idString] = workspaceTypeAndId.split(":");
  const workspaceId: Uuid = new Uuid(idString);
  const workspace = await connectService.requestWorkspace(
    workspaceType as WorkspaceType,
    workspaceId
  );
  configService.updateWorkspace(workspace);
  await messageService.showSuccess(
    "Notion is connected successfully",
    "Fika Quick Start Documentation",
    "https://blog.fikadev.com/posts/start-fika"
  );
};
