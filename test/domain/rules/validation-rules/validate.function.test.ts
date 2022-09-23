import { validateBranchName, validateHttpAddress, validateHttpsGithubAddress, validateIncludeString, validateIssueNumber, validateNumber, validateSshGithubAddress } from "@/domain/rules/validation-rules/validate.functions";
import container from "src/config/ioc_config";
import * as E from 'fp-ts/Either';
import * as assert from 'assert';
import { pipe } from "fp-ts/lib/function";
import { TEST_CPR_BRANCH_NAME, TEST_GIT_STATUS_STRING, TEST_HTTPS_GITHUB_REPO, TEST_SSH_GITHUB_REPO, TEST_UNVALID_BRANCH_NAME } from "test/test-constants";
import { noRemote, unstagedChangePattern } from "@/domain/git-command/parser/parser.values";

beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});


test('1. validateNumber', async () => {
  const validNumber = validateNumber(123);
  expect(E.isRight(validNumber)).toEqual(true);
  assert.deepEqual(validNumber, E.right(123))
  const nan = validateNumber(NaN);
  expect(E.isLeft(nan)).toEqual(true);
  assert.deepEqual(nan, E.left({
    type: "NotNumberError", value: NaN 
 }))
});

test('2. validateIssueNumber', async () => {
  const validIssueNumber = validateIssueNumber(123);
  expect(E.isRight(validIssueNumber)).toEqual(true);
  assert.deepEqual(validIssueNumber, E.right(123))
  const undefinedIssueNumber = validateIssueNumber(undefined);
  expect(E.isLeft(undefinedIssueNumber)).toBe(true);
  assert.deepEqual(undefinedIssueNumber, E.left({
    type: "NotIssueNumberError", value: undefined 
  }))
});

test('3. validateHttpAddress', async () => {
  const validHttpAddress = validateHttpAddress("https://github.com");
  expect(E.isRight(validHttpAddress)).toBe(true);
  assert.deepEqual(validHttpAddress, E.right("https://github.com"))
  const unvalidHttpAddress = validateHttpAddress("www.github.com");
  expect(E.isRight(unvalidHttpAddress)).toBe(false);
});

test('4. validateIncludeString', async () => {
  const validIncluded = validateIncludeString(unstagedChangePattern)(TEST_GIT_STATUS_STRING);
  expect(E.isRight(validIncluded)).toBe(true);
  expect(pipe(validIncluded, E.getOrElse((e)=>'Error'))).toEqual(TEST_GIT_STATUS_STRING);
  const notIncluded = validateIncludeString(noRemote)(TEST_GIT_STATUS_STRING);
  expect(E.isRight(notIncluded)).toBe(false);
});

test('5. validateBranchName', async () => {
  const validFeatureBranchName = validateBranchName(TEST_CPR_BRANCH_NAME);
  expect(E.isRight(validFeatureBranchName)).toBe(true);
  const validDevelopBranchName = validateBranchName('develop');
  expect(E.isRight(validDevelopBranchName)).toBe(true);
  const unvalidBranchName = validateBranchName(TEST_UNVALID_BRANCH_NAME);
  expect(E.isRight(unvalidBranchName)).toBe(false);
});

test('6. validateHttpsGithubAddress', async () => {
  const validRepo = validateHttpsGithubAddress(TEST_HTTPS_GITHUB_REPO);
  expect(E.isRight(validRepo)).toBe(true)
  expect(pipe(validRepo, E.getOrElse((e)=>'Error'))).toEqual(TEST_HTTPS_GITHUB_REPO)
  const unvalidRepo = validateHttpsGithubAddress(TEST_SSH_GITHUB_REPO);
  expect(E.isRight(unvalidRepo)).toBe(false);
});

test('7. validateSshGithubAddress', async () => {
  const validRepo = validateSshGithubAddress(TEST_SSH_GITHUB_REPO);
  expect(E.isRight(validRepo)).toBe(true)
  expect(pipe(validRepo, E.getOrElse((e)=>'Error'))).toEqual(TEST_SSH_GITHUB_REPO)
  const unvalidRepo = validateSshGithubAddress(TEST_HTTPS_GITHUB_REPO);
  expect(E.isRight(unvalidRepo)).toBe(false);
});



