import {
  TEST_CHANGE_FILE_PATH,
  TEST_CPR_BRANCH_NAME,
  TEST_CPR_COMMIT_MESSAGE,
} from "test/test-constants";
import {
  checkAndCloneRepo,
  checkOutToBranch,
  createTestConfig,
  deleteBranch,
  makeMeaninglessChange,
  readTestFikaConfig,
  restoreGitRepo,
  setAuthToken,
  stageAndCommit,
} from "test/test-utils";
import { createPRAction } from "./create-pr.action";

beforeAll(async () => {
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
  setAuthToken();
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
  jest.spyOn(console, "log").mockImplementation(() => true);
});

beforeEach(async () => {});

afterEach(async () => {
  await deleteBranch(TEST_CPR_BRANCH_NAME);
  const config = readTestFikaConfig(process.env.TESTING_PATH);
  await checkOutToBranch(config.git.baseBranch);
});

afterAll(() => {});

test("1. create PR test", async () => {
  await checkOutToBranch(TEST_CPR_BRANCH_NAME);
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
  makeMeaninglessChange(TEST_CHANGE_FILE_PATH);
  await stageAndCommit(TEST_CPR_COMMIT_MESSAGE);
  const result = await createPRAction();
  expect(result).toBeUndefined();
});
