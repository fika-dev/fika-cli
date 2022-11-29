import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import {
  switchNoWorkspace,
  switchOneWorkspace,
  switchMultiWorkspace,
  setNewWorkspace,
} from "@/actions/fika/set-workspace.action";

export const setAction = async (workspaceTypeAndId?: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  if (workspaceTypeAndId === undefined) {
    const workspaceList = configService.getWorkspaceList();
    if (workspaceList === "NOT_CONNECTED") {
      await switchNoWorkspace();
    } else if (workspaceList.length === 1) {
      await switchOneWorkspace(workspaceList[0]);
    } else {
      await switchMultiWorkspace(workspaceList);
    }
  } else {
    await setNewWorkspace(workspaceTypeAndId);
  }
};
