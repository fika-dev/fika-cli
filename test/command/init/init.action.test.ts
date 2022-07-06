import { initAction } from "src/command/init/init.action";
import { clearTestFikaPath, readTestFikaConfig } from "test/test-utils";


beforeAll(() => {
  clearTestFikaPath(process.env.TESTING_PATH);
});

afterAll(() => {
  clearTestFikaPath(process.env.TESTING_PATH);
});

test('1. create config & check notion workspace', () => { 
  initAction(process.env.TESTING_PATH);
  const config = readTestFikaConfig(process.env.TESTING_PATH);
  expect(config.notionWorkspace).toBe("NOT_CONNECTED");
});