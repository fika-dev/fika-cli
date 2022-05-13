import { initAction } from "src/command/init/init.action";
import { setAction } from "src/command/set/set.action";
import container from "src/config/ioc_config";
import { NotionWorkspace } from "src/domain/entity/notion_workspace.entity";
import { TEST_FIKA_BOT_ID } from "test/test-constants";
import { readTestFikaConfig } from "test/test-utils";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import axios from "axios";

beforeAll(()=>{
  
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});

test('1. guide notion authentication', async () => { 
  const uri = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService).getNotionAuthenticationUri();
  const response = await axios.get(uri);
  expect(response.status).toEqual(200);
});


test('2. get notion workspace', async () => { 
  const notionWorkspace = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService).requestNotionWorkspace('80aecc8f-da82-4a8b-bb87-7c594be20c05');
  expect(notionWorkspace).toBeDefined();
});