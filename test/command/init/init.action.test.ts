import { initAction } from "src/command/init/init.action";
import { clearTestFikaPath, readTestFikaConfig } from "test/test-utils";


beforeAll(() => {
  clearTestFikaPath(process.cwd()+'/test');
});

afterAll(() => {
  clearTestFikaPath(process.cwd()+'/test');
});

test('1. create config & check notion workspace', () => { 
  initAction(process.env.TESTING_PATH);
  const config = readTestFikaConfig(process.env.TESTING_PATH);
  expect(config.notionWorkspace).toBe("NOT_CONNECTED");
});