import { Uuid } from "@/domain/value_object/uuid.vo";
import axios from "axios";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConnectService } from "src/domain/service/i_connect.service";
import { TEST_FIKA_BOT_ID } from "test/test-constants";
import { checkAndCloneRepo } from "test/test-utils";

beforeAll(()=>{
  checkAndCloneRepo()
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
  const botId = new Uuid(TEST_FIKA_BOT_ID);
  const notionWorkspace = await container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService).requestNotionWorkspace(botId);
  expect(notionWorkspace).toBeDefined();
});