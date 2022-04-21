import { Container } from "inversify";
import "reflect-metadata";
import { AnalyzeService } from "src/domain/service/analyze.service";
import { ConfigService } from "src/domain/service/config.service";
import { ConnectService } from "src/domain/service/connnect.service";
import { IAnalyzeService } from "src/domain/service/i_analyze.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { IMessageService } from "src/domain/service/i_message.service";
import { IMorphService } from "src/domain/service/i_morph.service";
import { ISnapshotService } from "src/domain/service/i_snapshot.service";
import { MessageService } from "src/domain/service/message.service";
import { MorphService } from "src/domain/service/morph.service";
import { SnapshotService } from "src/domain/service/snapshot.service";
import SERVICE_IDENTIFIER from "./constants/identifiers";




let container = new Container();

container.bind<IAnalyzeService>(SERVICE_IDENTIFIER.AnalyzeService).to(AnalyzeService);
container.bind<IConfigService>(SERVICE_IDENTIFIER.ConfigService).to(ConfigService);
container.bind<IConnectService>(SERVICE_IDENTIFIER.ConnectService).to(ConnectService);
container.bind<IMorphService>(SERVICE_IDENTIFIER.MorphService).to(MorphService);
container.bind<IMessageService>(SERVICE_IDENTIFIER.MessageService).to(MessageService);
container.bind<ISnapshotService>(SERVICE_IDENTIFIER.SnapshotService).to(SnapshotService);


export default container;
