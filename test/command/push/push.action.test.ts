import { analyzeAction } from "src/command/analyze/analyze.action";
import { initAction } from "src/command/init/init.action";
import { pushAction } from "src/command/push/push.action";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { DevObject } from "src/domain/entity/dev_object.entity";
import { clearTestFikaPath, readTestSnapshot } from "test/test-utils";

const SAMPLE_1_PATH =  process.cwd()+'/test/test-samples/sample_01'

beforeEach(()=>{
  clearTestFikaPath(SAMPLE_1_PATH);
  initAction(SAMPLE_1_PATH);
});

test('', 
  async ()=>{
    container.unbind(SERVICE_IDENTIFIER.ConnectService);
    let connectionServiceMock = {
      create: (devObj: DevObject) => 'sample_test_uri'
    }
    container.bind<any>(SERVICE_IDENTIFIER.ConnectService).toConstantValue(connectionServiceMock);
    const snapshot = await analyzeAction();
    await pushAction(snapshot, SAMPLE_1_PATH);
    const syncedSnapshot = readTestSnapshot(SAMPLE_1_PATH);
    expect(syncedSnapshot.components.length).toBeGreaterThan(0);
})