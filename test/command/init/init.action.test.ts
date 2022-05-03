import { initAction } from "src/command/init/init.action";
import { clearTestFikaPath, readTestFikaConfig } from "test/test-utils";


beforeAll(() => {
  clearTestFikaPath(process.cwd());
});

afterAll(() => {
  clearTestFikaPath(process.cwd());
});

test('1. create config & check notion workspace', () => { 
  const testRoot = process.cwd() + '/test';
  initAction(testRoot);
  const config = readTestFikaConfig(process.cwd());
  expect(config.notionWorkspace).toBe("NOT_CONNECTED");
});