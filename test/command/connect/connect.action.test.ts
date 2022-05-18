import { Uuid } from "@/domain/value_object/uuid.vo";
import axios from "axios";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConnectService } from "src/domain/service/i_connect.service";

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
  const botId = new Uuid('80aecc8f-da82-4a8b-bb87-7c594be20c05');
  const notionWorkspace = await container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService).requestNotionWorkspace(botId);
  console.log('🧪', ' in ConnectActionTest: ', 'notionWorkspace: ', notionWorkspace);
  expect(notionWorkspace).toBeDefined();
});