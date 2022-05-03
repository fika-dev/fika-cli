import { initAction } from "src/command/init/init.action";
import { clearTestFikaPath } from "test/test-utils";


beforeAll(() => {
  // clearTestFikaPath(process.cwd());
});

afterAll(() => {
  // clearTestFikaPath(process.cwd());
});

test('create config', () => { 
  const testRoot = process.cwd() + '/test';
  initAction(testRoot);
});