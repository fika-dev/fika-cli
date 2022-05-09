import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import { PUSH_SUCCESS_MESSAGE } from "src/config/constants/messages";
import container from "src/config/ioc_config";
import { ObjectType } from "src/domain/entity/dev_object.entity";
import { Snapshot } from "src/domain/entity/snapshot.entity";
import { IConnectService } from "src/domain/service/i_connect.service";
import { IMessageService } from "src/domain/service/i_message.service";
import { IMorphService } from "src/domain/service/i_morph.service";
import { ISnapshotService } from "src/domain/service/i_snapshot.service";

export const pushAction = async (analyzedSnapshot: Snapshot, currentPath: string)=>{
  const snapshotService = container.get<ISnapshotService>(SERVICE_IDENTIFIER.SnapshotService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const morphService = container.get<IMorphService>(SERVICE_IDENTIFIER.MorphService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const snapshot = snapshotService.loadSnapshot(currentPath);
  const difference = snapshotService.compare(analyzedSnapshot);
  await Promise.all(difference.toBeCreated.map(async (devObj)=> {
    const uri = await connectService.create(devObj);
    if (devObj.objectType === ObjectType.Component){
      await morphService.addFikaUri(uri, devObj.id);
    }
    devObj.id = uri;
  }));
  //[TODO] toBeUpdated, toBeRemoved
  snapshotService.saveSyncedSnapshot(new Snapshot(difference.toBeCreated));
  messageService.showSuccess(PUSH_SUCCESS_MESSAGE);
}