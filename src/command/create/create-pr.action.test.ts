import { createIssueAction } from "@/command/create/create-issue.action";
import { TEST_CHANGE_FILE_PATH, TEST_CPR_BRANCH_NAME, TEST_CPR_DOC_ID } from "test/test-constants";
import { checkOutToBranch, createTestConfig, makeMeaninglessChange, setAuthToken } from "test/test-utils";


beforeAll(() => {
  createTestConfig(process.env.TESTING_PATH+'/.fika')
  setAuthToken();
});

beforeEach(() => {
  checkOutToBranch(TEST_CPR_BRANCH_NAME);
  makeMeaninglessChange(TEST_CHANGE_FILE_PATH);
});

afterAll(() => {
  
});

test('1. create PR test', async () => {
  
});