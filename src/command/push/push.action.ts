import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import { PUSH_SUCCESS_MESSAGE } from "src/config/constants/messages";
import container from "src/config/ioc_config";
import { Snapshot } from "src/domain/entity/snapshot.entity";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { IMessageService } from "src/domain/service/i_message.service";
import { IMorphService } from "src/domain/service/i_morph.service";
import { ISnapshotService } from "src/domain/service/i_snapshot.service";

export const pushAction = async (snapshot: Snapshot)=>{
  const snapshotService = container.get<ISnapshotService>(SERVICE_IDENTIFIER.SnapshotService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const morphService = container.get<IMorphService>(SERVICE_IDENTIFIER.MorphService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MorphService);

  const difference = snapshotService.compare(snapshot);
  difference.toBeCreated.forEach(async (devObj)=> {
    const uri = await connectService.create(devObj);
    morphService.addFikaUri(uri);
  });
  //[TODO] toBeUpdated, toBeRemoved
  snapshotService.saveSyncedSnapshot(snapshot);
  messageService.showSuccess(PUSH_SUCCESS_MESSAGE);
}