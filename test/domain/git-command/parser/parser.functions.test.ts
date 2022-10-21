import { checkCurrentBranch, checkGhCliVersion, checkGitVersion, checkHeadParser, checkMergeConflict, parseRemoteAddress, checkStagedChangesParser, checkUnstagedChangeParser, checkUntrackedFilesParser, parseMultipleLines, parseGithubUrl } from "@/domain/git-command/parser/parser.functions";
import { TEST_BRANCH_LIST, TEST_CPR_BRANCH_NAME, TEST_GIT_CLEAN_STATUS, TEST_GIT_MERGE_CONFLICT_STATUS, TEST_GIT_NO_REMOTE, TEST_GIT_STATUS_STRING, TEST_GIT_STATUS_WITH_STAGED, TEST_HEAD_NOT_DEFINED, TEST_HTTPS_GITHUB_REPO, TEST_NO_COMMIT_STATUS, TEST_SSH_GITHUB_REPO, TEST_GIT_VERSION_OUTPUT, TEST_GH_VERSION_OUTPUT, TEST_NOT_INSTALLED, TEST_GH_VERSION_ONE_LINE_OUPUT, TEST_CPR_COMMIT_MESSAGE, TEST_GITHUB_URL } from "test/test-constants";

beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
});

afterEach(()=>{
});


test('1. checkHeadParser', async () => {
  const shouldBeFalse = checkHeadParser(TEST_NO_COMMIT_STATUS);
  expect(shouldBeFalse).toEqual(false);
  const shoudBeTrue = checkHeadParser(TEST_GIT_STATUS_STRING);
  expect(shoudBeTrue).toEqual(true);
});

test('2. checkUnstagedChangeParser', async () => {
  const shouldBeFalse = checkUnstagedChangeParser(TEST_NO_COMMIT_STATUS);
  expect(shouldBeFalse).toEqual(false);
  const shoudBeTrue = checkUnstagedChangeParser(TEST_GIT_STATUS_STRING);
  expect(shoudBeTrue).toEqual(true);
});

test('3. checkUntrackedFilesParser', async () => {
  const shouldBeFalse = checkUntrackedFilesParser(TEST_NO_COMMIT_STATUS);
  expect(shouldBeFalse).toEqual(false);
  const shoudBeTrue = checkUntrackedFilesParser(TEST_GIT_STATUS_STRING);
  expect(shoudBeTrue).toEqual(true);
  const shouldBeFalse2 = checkUnstagedChangeParser(TEST_GIT_CLEAN_STATUS);
  expect(shouldBeFalse2).toEqual(false);

});

test('4. checkStagedChangesParser', async () => {
  const shouldBeFalse = checkStagedChangesParser(TEST_NO_COMMIT_STATUS);
  expect(shouldBeFalse).toEqual(false);
  const shouldBeFalse2 = checkStagedChangesParser(TEST_GIT_STATUS_STRING);
  expect(shouldBeFalse2).toEqual(false);
  const shouldBeTrue = checkStagedChangesParser(TEST_GIT_STATUS_WITH_STAGED);
  expect(shouldBeTrue).toEqual(true);
  const shouldBeFalse3 = checkStagedChangesParser(TEST_GIT_CLEAN_STATUS);
  expect(shouldBeFalse3).toEqual(false);
});


test('5. checkMergeConflict', async () => {
  const shouldBeTrue = checkMergeConflict(TEST_GIT_MERGE_CONFLICT_STATUS);
  expect(shouldBeTrue).toEqual(true);
  const shouldBeFalse = checkMergeConflict(TEST_GIT_STATUS_STRING);
  expect(shouldBeFalse).toEqual(false);
  const shouldBeFalse2 = checkStagedChangesParser(TEST_GIT_CLEAN_STATUS);
  expect(shouldBeFalse2).toEqual(false);
});

test('6. checkRemoteOrigin', async () => {
  const shouldBeEmpty = parseRemoteAddress(TEST_GIT_NO_REMOTE);
  expect(shouldBeEmpty).toEqual("Empty");
  const remoteRepo = parseRemoteAddress(`${TEST_HTTPS_GITHUB_REPO}\n`);
  expect(remoteRepo).toEqual(TEST_HTTPS_GITHUB_REPO);
  const remoteRepo2 = parseRemoteAddress('\n'+TEST_SSH_GITHUB_REPO);
  expect(remoteRepo2).toEqual(TEST_SSH_GITHUB_REPO);
});

test('7. checkCurrentBranch', async () => {
  const validBranch = checkCurrentBranch("\n"+TEST_CPR_BRANCH_NAME);
  expect(validBranch).toEqual(TEST_CPR_BRANCH_NAME);
  const empty = checkCurrentBranch(TEST_HEAD_NOT_DEFINED);
  expect(empty).toEqual("Empty");
  const unvalidBranch = checkCurrentBranch('Somthing strange is here');
  expect(unvalidBranch).toEqual({type: 'ValidationError',subType: "NotBranchName", value: "Somthing strange is here"});
});

test('8. parseBranches', async () => {
  const validBranches = parseMultipleLines(TEST_BRANCH_LIST);
  expect(validBranches).toContain('develop');
  const emptyBranches = parseMultipleLines(`\n`);
  expect(emptyBranches).toEqual([]);
  // const empty = parseBranches(TEST_HEAD_NOT_DEFINED);
  // expect(empty).toEqual("Empty");
  // const unvalidBranch = parseBranches('Somthing strange is here');
  // expect(unvalidBranch).toEqual({type: 'ValidationError',subType: "NotBranchName", value: "Somthing strange is here"});
});

test("9. checkGitVersion", async () => {
  const validGitVersion = checkGitVersion(TEST_GIT_VERSION_OUTPUT);
  expect(validGitVersion).toContain('git version 2.32.1');
  const notInstalled = checkGitVersion(TEST_NOT_INSTALLED);
  expect(notInstalled).toContain('NotInstalled');
  const emptyValue = checkGitVersion(' ');
  expect(emptyValue).toEqual( { type: 'ValidationError',subType: 'NotIncludingPattern', value: '' });
});

test("10. checkGhCliVersion", async () => {
  const validGhVersion = checkGhCliVersion(TEST_GH_VERSION_OUTPUT);
  expect(validGhVersion).toContain('gh version 2.14.7');
  const validGhOneLineVersion = checkGhCliVersion(TEST_GH_VERSION_ONE_LINE_OUPUT);
  expect(validGhOneLineVersion).toContain('gh version 2.14.7')
  const notInstalled = checkGhCliVersion(TEST_NOT_INSTALLED);
  expect(notInstalled).toContain('NotInstalled');
  const notInstalledFromRandomMessage = checkGhCliVersion(TEST_CPR_COMMIT_MESSAGE);
  expect(notInstalledFromRandomMessage).toEqual({ type: 'ValidationError',subType: 'NotIncludingPattern', value: '[add] meaningless white space' });
  const emptyValue = checkGhCliVersion(' ');
  expect(emptyValue).toEqual( { type: 'ValidationError',subType: 'NotIncludingPattern', value: '' });
});

test('11.2 getGitRepoHttpUrl from https', async () => {
  const githubUrl = parseGithubUrl(TEST_HTTPS_GITHUB_REPO);
  expect(githubUrl).toEqual(TEST_GITHUB_URL);
});


test('11.1 getGitRepoHttpUrl from ssh', async () => {
  const githubUrl = parseGithubUrl(TEST_SSH_GITHUB_REPO);
  expect(githubUrl).toEqual(TEST_GITHUB_URL);
});

