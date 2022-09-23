import { checkContext } from "@/domain/context/context.functions";
import { ExecuteGitCommand } from "@/domain/git-command/command.types";
import { ValidationError } from "@/domain/rules/validation-rules/validation-rule.types";
import { isGitCleanStatus } from "@/domain/rules/validation-rules/validation-rules.functions";
import * as T from 'fp-ts/Task';
import container from "src/config/ioc_config";
import { TEST_BRANCH_LIST, TEST_GIT_CLEAN_STATUS, TEST_GIT_STATUS_STRING, TEST_HTTPS_GITHUB_REPO } from "test/test-constants";

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
