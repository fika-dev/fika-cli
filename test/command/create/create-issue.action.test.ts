import { createIssueAction } from "@/command/create/create-issue.action";
import { TEST_CI_DOC_ID } from "test/test-constants";
import { createTestConfig, setAuthToken } from "test/test-utils";


beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => true);
  createTestConfig(process.env.TESTING_PATH+'/.fika')
  setAuthToken();
});

afterAll(() => {
  
});

test('1. create issue test', async () => {
  const result = await createIssueAction(TEST_CI_DOC_ID);
  expect(result).toBeUndefined();
});