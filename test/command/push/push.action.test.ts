import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IMessageService } from "@/domain/service/i_message.service";

const SAMPLE_1_PATH =  process.cwd()+'/test/test-samples/sample_01'

beforeEach( ()=>{
  
});

beforeAll(async ()=>{
  // await restoreGitRepo(SAMPLE_1_PATH);
})

afterEach(
   async ()=>{
    // const syncedSnapshot = readTestSnapshot(SAMPLE_1_PATH);
    //  await restoreGitRepo(SAMPLE_1_PATH)
  }
)

afterAll(()=>{
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.close();
});

it('',()=>{})
// test('1. test push action', 
//   async ()=>{
//     container.unbind(SERVICE_IDENTIFIER.ConnectService);
//     let connectionServiceMock = {
//       create: (devObj: DevObject) => 'sample_test_uri'
//     }
//     container.bind<any>(SERVICE_IDENTIFIER.ConnectService).toConstantValue(connectionServiceMock);
//     const snapshot = await analyzeAction();
//     await pushAction(snapshot, SAMPLE_1_PATH);
//     const syncedSnapshot = readTestSnapshot(SAMPLE_1_PATH);
//     expect(syncedSnapshot.components.length).toBeGreaterThan(0);
// })