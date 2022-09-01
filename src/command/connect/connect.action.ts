import SERVICE_IDENTIFIER, { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { WorkspaceType } from "@/domain/entity/add_on/workspace.entity";
import { IMessageService } from "@/domain/service/i_message.service";
import open from "open";
import { WorkspaceCreator } from "plug_in/workspace/workspace-creator";

export const connectAction = async (type: WorkspaceType) => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const domain = container.get<string>(PARAMETER_IDENTIFIER.Domain);
  const workspace = WorkspaceCreator.fromType(type);
  const uri = workspace.getAuthenticationUri(domain);
  messageService.showConnecting(uri);
  await open(uri);
};
