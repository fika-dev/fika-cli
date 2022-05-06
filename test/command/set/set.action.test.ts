import { initAction } from "src/command/init/init.action";
import { setAction } from "src/command/set/set.action";
import container from "src/config/ioc_config";
import { NotionWorkspace } from "src/domain/entity/notion_workspace.entity";
import { TEST_FIKA_BOT_ID } from "test/test-constants";
import { clearTestFikaPath, readTestFikaConfig } from "test/test-utils";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import { IConfigService } from "src/domain/service/i_config.service";

beforeAll(()=>{
  clearTestFikaPath(process.cwd()+'/test');
  initAction(process.cwd()+'/test');
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});

test('1. set with correct bot id', async () => { 
  container.unbind(SERVICE_IDENTIFIER.ConnectService);
  let connectionServiceMock = {
    requestNotionWorkspace: async (botId: string): Promise<NotionWorkspace>=>{
      return NotionWorkspace.getSample(botId);
    }
  }
  container.bind<any>(SERVICE_IDENTIFIER.ConnectService).toConstantValue(connectionServiceMock);
  await setAction(TEST_FIKA_BOT_ID);
  container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService).readConfig()
  const config = readTestFikaConfig(process.cwd());
  expect((config.notionWorkspace as NotionWorkspace).botId).toEqual(TEST_FIKA_BOT_ID);
});