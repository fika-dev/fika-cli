import { checkContext } from "@/domain/context/context.functions";
import { DomainError } from "@/domain/general/general.types";
import { ExecuteGitCommand } from "@/domain/git-command/command.types";
import * as T from 'fp-ts/Task';
import container from "src/config/ioc_config";
import { TEST_BRANCH_LIST, TEST_GIT_STATUS_STRING } from "test/test-constants";

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
    return T.of(TEST_GIT_STATUS_STRING);
  }else if (gitCommand.command === 'rev-parse --abbrev-ref HEAD'){
    return T.of('Somthing strange is here');
  }else{
    return T.of(TEST_BRANCH_LIST);
  }
}

test('1. checkContext', async () => {
  const shouldBeTrue =  await checkContext(mockExecuteGitCommand)({
    domain: 'git',
    field: 'unstagedChanges',
  })();
  expect(shouldBeTrue).toBe(true);
  const shouldBeList = await checkContext(mockExecuteGitCommand)({
    domain: 'git',
    field: 'localBranches',
  })();
  expect(shouldBeList).toContain('develop');
  const shouldBeError = await checkContext(mockExecuteGitCommand)({
    domain: 'git',
    field: 'currentBranch',
  })();
  const shouldBeErrorAsError  = shouldBeError as DomainError;
  expect(shouldBeErrorAsError.subType).toBe("NotBranchName");
  expect(shouldBeErrorAsError.value).toBe("Somthing strange is here");
});
