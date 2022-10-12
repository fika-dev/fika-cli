import { ExecuteCommand, ExecuteGitCommand } from "@/domain/git-command/command.types";
import { getBranchesCmd } from "@/domain/git-command/git-command.values";

import { existsLocalBranch, isGitAndGhCliInstalled, isGitCleanStatus } from "@/domain/rules/validation-rules/validation-rules.functions";
import * as T from 'fp-ts/Task';
import container from "src/config/ioc_config";
import { TEST_BRANCH_LIST, TEST_GIT_CLEAN_STATUS, TEST_GIT_STATUS_STRING, TEST_GIT_VERSION_OUTPUT, TEST_HTTPS_GITHUB_REPO, TEST_NOT_INSTALLED } from "test/test-constants";

beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});

const mockExecuteGitCommand: ExecuteGitCommand = (gitCommand) => {
  if (gitCommand.command === 'status'){
    return T.of(TEST_GIT_CLEAN_STATUS);
  }else if (gitCommand.command === 'rev-parse --abbrev-ref HEAD'){
    return T.of('Somthing strange is here');
  }else if (gitCommand.command === 'remote get-url'){
    return T.of(TEST_HTTPS_GITHUB_REPO);
  }else{
    return T.of(TEST_BRANCH_LIST);
  }
}



const mockExecuteGitCommandForError: ExecuteGitCommand = (gitCommand) => {
  if (gitCommand.command === 'status'){
    return T.of(TEST_GIT_STATUS_STRING);
  }else if (gitCommand.command === 'rev-parse --abbrev-ref HEAD'){
    return T.of('Somthing strange is here');
  }else if (gitCommand.command === 'remote get-url'){
    return T.of(TEST_HTTPS_GITHUB_REPO);
  }else{
    return T.of(TEST_BRANCH_LIST);
  }
}

test('1. isGitCleanStatus', async () => {
  const shouldBeTrue =  await isGitCleanStatus(mockExecuteGitCommand)
  expect(shouldBeTrue).toBe(true);
  const shouldBeFalse =  await isGitCleanStatus(mockExecuteGitCommandForError)
  expect(shouldBeFalse).toBe(false);
});

const mockExecuteCommand: ExecuteCommand = (command) => {
  if (command.command = 'git --version') {
    return T.of(TEST_GIT_VERSION_OUTPUT);
  }if (command.command = getBranchesCmd.command) {
    return T.of(TEST_BRANCH_LIST);
  }
  throw command
}

const mockExecuteCommandForError: ExecuteCommand = (command) => {
  if (command.command = 'git --version') {
    return T.of(TEST_NOT_INSTALLED);
  } else if (command.command = 'gh --version') {
    return T.of(TEST_NOT_INSTALLED);
  }
}

test('2. isGitAndGhCliInstalled', async () => {
  const shouldBeTrue = await isGitAndGhCliInstalled(mockExecuteCommand);
  expect(shouldBeTrue).toBe(true);
  const shouldBeFalse = await isGitAndGhCliInstalled(mockExecuteCommandForError);
  expect(shouldBeFalse);
});



test('3. existsLocalBranch', async () => {
  const mock: ExecuteCommand = (command) => {
    if (command.command = getBranchesCmd.command) {
      return T.of(TEST_BRANCH_LIST);
    }
    throw command
  }
  const shouldBeTrue = await existsLocalBranch(mock)("feature/iss/#138");
  expect(shouldBeTrue).toBe(true);
  const shouldBeFalse = await existsLocalBranch(mock)("feature/iss/#2");
  expect(shouldBeFalse).toBe(false);
});

