import { IPromptService } from "@/domain/service/i-prompt.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { WorkspaceType } from "@/domain/entity/add_on/workspace_platform.entity";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { Workspace } from "@/domain/entity/workspace.entity";
import { Uuid } from "@/domain/value_object/uuid.vo";

export const switchNoWorkspace = async () => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  await messageService.showSuccess(
    `Your Fika account hasn't been connected to any workspace\n To connect to one, please, first run the command "fika connect <workspace_type>"\n and then copy the command "fika set <workspace_type:TOKEN>" from your browser\n and run it in your terninal`,
    "Fika Quick Start Documentation",
    "https://fikadev.com/manual"
  );
};
export const switchOneWorkspace = async (workspace: Workspace) => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  await messageService.showSuccess(
    `${workspace.workspaceName} from ${workspace.workspaceType} is the only workspace connected to your Fika account.`,
    "Fika Quick Start Documentation",
    "https://fikadev.com/manual"
  );
};
export const switchMultiWorkspace = async (workspaceList: Workspace[]) => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const newWorkspaceId = await promptService.askChooseWorkspace(workspaceList);
  configService.updateCurrentWorkspaceId(newWorkspaceId);
  await messageService.showSuccess(
    `This workspace has been set to be your current workspace.\n If you want to switch to another workspace, please run the command "fika set" again.`,
    "Fika Quick Start Documentation",
    "https://fikadev.com/manual"
  );
};
export const setNewWorkspace = async (workspaceTypeAndId: string) => {
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
    `The connection was successfully established with the workspace\n This workspace has been set to be your current workspace.\n If you want to switch to one of your previous workspace, please run the command "fika set"`,
    "Fika Quick Start Documentation",
    "https://fikadev.com/manual"
  );
};
