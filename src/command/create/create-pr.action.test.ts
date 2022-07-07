import { createIssueAction } from "@/command/create/create-issue.action";
import { TEST_CPR_BRANCH_NAME, TEST_CPR_DOC_ID } from "test/test-constants";
import { checkOutToBranch, createTestConfig, setAuthToken } from "test/test-utils";


beforeAll(() => {
  createTestConfig(process.env.TESTING_PATH+'/.fika')
  setAuthToken();
});

beforeEach(() => {
  checkOutToBranch(TEST_CPR_BRANCH_NAME);
});

afterAll(() => {
  
});

test('1. create PR test', async () => {
  
});