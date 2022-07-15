import { analyzeAction } from "src/command/analyze/analyze.action";

const SAMPLE_1_PATH =  process.cwd()+'/test/test-samples/sample_01'

beforeAll(()=>{
  
});

beforeEach(()=>{
});

afterEach(()=>{
  // container.restore();
});

describe('test sample_1', ()=>{
  
  test('1. get repos', async () => { 
    const snapshots = await analyzeAction();
    expect(snapshots.repo).toBeDefined();
  });
  // test('2. get components', async () => { 
  //   const snapshots = await analyzeAction();
  //   expect(snapshots.components.length).toBeGreaterThan(0);
  // });
})
