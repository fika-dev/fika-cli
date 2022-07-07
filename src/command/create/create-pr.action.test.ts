import { createIssueAction } from "@/command/create/create-issue.action";
import {
  TEST_CHANGE_FILE_PATH,
  TEST_CPR_BRANCH_NAME,
  TEST_CPR_COMMIT_MESSAGE,
  TEST_CPR_DOC_ID,
} from "test/test-constants";
import {
  checkAndCloneRepo,
  checkOutToBranch,
  createTestConfig,
  deleteBranch,
  makeMeaninglessChange,
  readTestFikaConfig,
  setAuthToken,
  stageAndCommit,
} from "test/test-utils";
import { createPRAction } from "./create-pr.action";

beforeAll(async () => {
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
  setAuthToken();
});

beforeEach(async () => {
  await checkOutToBranch(TEST_CPR_BRANCH_NAME);
  makeMeaninglessChange(TEST_CHANGE_FILE_PATH);
  await stageAndCommit(TEST_CPR_COMMIT_MESSAGE);
});

afterEach(async () => {
  await deleteBranch(TEST_CPR_BRANCH_NAME);
  const config = readTestFikaConfig(process.env.TESTING_PATH);
  await checkOutToBranch(config.git.baseBranch);
});

afterAll(() => {});

test("1. create PR test", async () => {
  const result = await createPRAction();
  expect(result).toBeUndefined();
});
