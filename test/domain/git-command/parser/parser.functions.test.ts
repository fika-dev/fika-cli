import { checkHeadParser, checkStagedChangesParser, checkUnstagedChangeParser, checkUntrackedFilesParser } from "@/domain/git-command/parser/parser.functions";
import { TEST_GIT_STATUS_STRING, TEST_GIT_STATUS_WITH_STAGED, TEST_NO_COMMIT_STATUS } from "test/test-constants";

beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
});

afterEach(()=>{
});


test('1. checkHeadParser', async () => {
  const shoulBeFalse = checkHeadParser(TEST_NO_COMMIT_STATUS);
  expect(shoulBeFalse).toEqual(false);
  const shoudBeTrue = checkHeadParser(TEST_GIT_STATUS_STRING);
  expect(shoudBeTrue).toEqual(true);
});

test('2. checkUnstagedChangeParser', async () => {
  const shoulBeFalse = checkUnstagedChangeParser(TEST_NO_COMMIT_STATUS);
  expect(shoulBeFalse).toEqual(false);
  const shoudBeTrue = checkUnstagedChangeParser(TEST_GIT_STATUS_STRING);
  expect(shoudBeTrue).toEqual(true);
});

test('3. checkUntrackedFilesParser', async () => {
  const shoulBeFalse = checkUntrackedFilesParser(TEST_NO_COMMIT_STATUS);
  expect(shoulBeFalse).toEqual(false);
  const shoudBeTrue = checkUntrackedFilesParser(TEST_GIT_STATUS_STRING);
  expect(shoudBeTrue).toEqual(true);
});

test('4. checkStagedChangesParser', async () => {
  const shoulBeFalse = checkStagedChangesParser(TEST_NO_COMMIT_STATUS);
  expect(shoulBeFalse).toEqual(false);
  const shoulBeFalse2 = checkStagedChangesParser(TEST_GIT_STATUS_STRING);
  expect(shoulBeFalse2).toEqual(false);
  const shouldBeTrue = checkStagedChangesParser(TEST_GIT_STATUS_WITH_STAGED);
  expect(shouldBeTrue).toEqual(true);
});


