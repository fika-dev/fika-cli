import { analyzeAction } from "src/command/analyze/analyze.action";
import { initAction } from "src/command/init/init.action";
import { clearTestFikaPath } from "test/test-utils";

beforeAll(()=>{
  
});

beforeEach(()=>{
  clearTestFikaPath(process.cwd()+'/test/test-samples/sample_1');
  initAction(process.cwd()+'/test/test-samples/sample_1');
});

afterEach(()=>{
  // container.restore();
});

describe('test sample_1', ()=>{
  
  test('1. get repos', async () => { 
    const snapshots = await analyzeAction();
    expect(snapshots.repo).toBeDefined();
  });
  test('2. get components', async () => { 
    const snapshots = await analyzeAction();
    console.log('🧪', ' in AnalyzeActionTest: ', ': ',snapshots.components);
    expect(snapshots.components.length).toBeGreaterThan(0);
  });
})
