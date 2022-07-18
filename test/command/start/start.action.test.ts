import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { TEST_CHANGE_FILE_PATH, TEST_CPR_BRANCH_NAME, TEST_CPR_COMMIT_MESSAGE } from "test/test-constants";
import { checkAndCloneRepo, checkOutToBranch, createTestConfig, deleteBranch, makeMeaninglessChange, restoreGitRepo, setAuthToken, stageAndCommit } from "test/test-utils";


beforeAll(async () => {
  await checkAndCloneRepo();
  createTestConfig(process.env.TESTING_PATH + "/.fika");
});

beforeEach(async()=>{
  await restoreGitRepo(process.env.TESTING_REPO_PATH);
});

afterAll(() => {
});

test('1. test pull from develop', async () => {
  const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitPlatformService.checkoutToBranchWithoutReset('develop');
  await gitPlatformService.pullFrom('develop');
});

test('2. check unstaged change', async () => {
  const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  await gitPlatformService.checkoutToBranchWithReset(TEST_CPR_BRANCH_NAME);
  const isChanged = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged).toBe(false);
  makeMeaninglessChange(TEST_CHANGE_FILE_PATH);
  const isChanged2 = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged2).toBe(true);
  await gitPlatformService.stash('tmp');
  const isChanged3 = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged3).toBe(false);
  await gitPlatformService.applyStash('tmp');
  const isChanged4 = await gitPlatformService.checkUnstagedChanges();
  expect(isChanged4).toBe(true);
});

