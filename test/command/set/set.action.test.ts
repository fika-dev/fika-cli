import container from "src/config/ioc_config";

beforeAll(()=>{
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});

it('',()=>{})
// test('1. set with correct bot id', async () => { 
//   container.unbind(SERVICE_IDENTIFIER.ConnectService);
//   let connectionServiceMock = {
//     requestNotionWorkspace: async (botId: string): Promise<NotionWorkspace>=>{
//       return NotionWorkspace.getSample(botId);
//     }
//   }
//   container.bind<any>(SERVICE_IDENTIFIER.ConnectService).toConstantValue(connectionServiceMock);
//   await setAction(TEST_FIKA_BOT_ID);
//   container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService).readConfig();
//   const config = readTestFikaConfig(process.cwd());
//   expect((config.notionWorkspace as NotionWorkspace).botId).toEqual(TEST_FIKA_BOT_ID);
// });