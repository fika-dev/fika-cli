import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { checkoutToIssue, checkoutWithChanges, getLatestBranchByCommit, getRemoteOrigin } from "@/domain/git-command/command.functions";
import { ExecuteGitCommand } from "@/domain/git-command/command.types";
import { applyStashCmd, createBranchCmd, fetchCmd, getBranchesCmd, getRemoteBranchesCmd, getRemoteUrlCmd, stashCmd } from "@/domain/git-command/git-command.values";
import { IPromptService } from "@/domain/service/i-prompt.service";
import * as T from 'fp-ts/Task';
import container from "src/config/ioc_config";
import { TEST_BRANCH_SORTED, TEST_CPR_BRANCH_NAME, TEST_GIT_CLEAN_STATUS, TEST_GIT_NO_REMOTE, TEST_GIT_STASH_APPLY_ERR, TEST_GIT_STASH_APPLY_NORMAL_OUTPUT, TEST_GIT_STATUS_WITH_STAGED, TEST_HTTPS_GITHUB_REPO, TEST_ISSUE_BRANCH_TEMPLATE, TEST_NOT_LOCAL_BRANCH, TEST_NOT_LOCAL_BUT_REMOTE_BRANCH, TEST_REMOTE_BRANCHES, TEST_SSH_GITHUB_REPO } from "test/test-constants";

beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});



test('1. getLatestBranchByCommit', async () => {
  const mockExecuteGitCommand: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "branch --format='%(refname:short)'"){
      return T.of(TEST_BRANCH_SORTED);
    }
  }
  const mockExecuteGitCommandForError: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "branch --format='%(refname:short)'"){
      return T.of('develop');
    }
  }
  const branch =  await getLatestBranchByCommit(mockExecuteGitCommand)(TEST_ISSUE_BRANCH_TEMPLATE);
  expect(branch).toBe(TEST_CPR_BRANCH_NAME);
  try{
    const developBranch =  await getLatestBranchByCommit(mockExecuteGitCommandForError)(TEST_ISSUE_BRANCH_TEMPLATE);
  }catch(e){
    expect(e).toEqual({
      type: "NoFeatureBranchInLocal",
    });
  }
});


test('2.1 checkoutWithChanges without stash', async () => {
  let checkoutBranch: string;
  const mockExecuteGitCommandClean: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
  }
  await checkoutWithChanges(mockExecuteGitCommandClean)(TEST_CPR_BRANCH_NAME);
  expect(checkoutBranch).toBe(TEST_CPR_BRANCH_NAME);
});

test('2.2 checkoutWithChanges with stash', async () => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  let checkoutBranch: string;
  let stashHasbeenCalled = false;
  let stashApplyHasbeenCalled = false;
  jest.spyOn(promptService, 'confirmAction').mockImplementationOnce(()=>Promise.resolve(true));
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }
    if (gitCommand.command === stashCmd.command){
      stashHasbeenCalled = true;
      return T.of(TEST_BRANCH_SORTED);
    }
    if (gitCommand.command === applyStashCmd.command){
      stashApplyHasbeenCalled = true;
      return T.of(TEST_GIT_STASH_APPLY_NORMAL_OUTPUT);
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
  }
  await checkoutWithChanges(mockExecuteWithChange)(TEST_CPR_BRANCH_NAME);
  expect(stashHasbeenCalled).toBe(true);
  expect(stashApplyHasbeenCalled).toBe(true);
  expect(checkoutBranch).toBe(TEST_CPR_BRANCH_NAME);
});


test('2.3 checkoutWithChanges error while stash', async () => {
  // [TODO] handle this case
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  let checkoutBranch: string;
  let stashHasbeenCalled = false;
  let stashApplyHasbeenCalled = false;
  jest.spyOn(promptService, 'confirmAction').mockImplementationOnce(()=>Promise.resolve(true));
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }
    if (gitCommand.command === stashCmd.command){
      stashHasbeenCalled = true;
      return T.of(TEST_BRANCH_SORTED);
    }
    if (gitCommand.command === applyStashCmd.command){
      stashApplyHasbeenCalled = true;
      return T.of(TEST_GIT_STASH_APPLY_ERR);
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
  }
  await checkoutWithChanges(mockExecuteWithChange)(TEST_CPR_BRANCH_NAME);
  expect(stashHasbeenCalled).toBe(true);
  expect(stashApplyHasbeenCalled).toBe(true);
  expect(checkoutBranch).toBe(TEST_CPR_BRANCH_NAME);
});



test('2.4 checkoutWithChanges refuse to move changes', async () => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  let checkoutBranch: string;
  let stashHasbeenCalled = false;
  let stashApplyHasbeenCalled = false;
  jest.spyOn(promptService, 'confirmAction').mockImplementationOnce(()=>Promise.resolve(false));
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }
    if (gitCommand.command === stashCmd.command){
      stashHasbeenCalled = true;
      return T.of(TEST_BRANCH_SORTED);
    }
    if (gitCommand.command === applyStashCmd.command){
      stashApplyHasbeenCalled = true;
      return T.of(TEST_GIT_STASH_APPLY_ERR);
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
  }
  try{
    await checkoutWithChanges(mockExecuteWithChange)(TEST_CPR_BRANCH_NAME);
    expect(false).toBe(true);
  }catch(e){
    expect(stashHasbeenCalled).toBe(false);
    expect(stashApplyHasbeenCalled).toBe(false);
    expect(checkoutBranch).toBe(undefined);
  }
});


test('3.1 getRemoteOrigin with url', async () => {
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === getRemoteUrlCmd.command){
      return T.of(TEST_HTTPS_GITHUB_REPO);
    }
  }
  const remoteOrigin = await getRemoteOrigin(mockExecuteWithChange)();
  expect(remoteOrigin).toBe(TEST_HTTPS_GITHUB_REPO);
});

test('3.2 getRemoteOrigin with empty', async () => {
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === getRemoteUrlCmd.command){
      return T.of(TEST_GIT_NO_REMOTE);
    }
  }
  const remoteOrigin = await getRemoteOrigin(mockExecuteWithChange)();
  expect(remoteOrigin).toBe("Empty");
});

test('4.1 checkoutToIssue without creating branch', async () => {
  let checkoutBranch: string;
  let hasCreateBranchCalled = false;
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    if (gitCommand.command === createBranchCmd.command){
      hasCreateBranchCalled = true;
      return T.of('');
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
    if (gitCommand.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_SORTED)
    }
    if (gitCommand.command === getRemoteBranchesCmd.command){
      return T.of(TEST_REMOTE_BRANCHES)
    }
  }
  await checkoutToIssue(mockExecuteWithChange)({
    issueUrl: '',
    title: '',
    labels: [],
    branchName: TEST_CPR_BRANCH_NAME,
  });
  expect(checkoutBranch).toBe(TEST_CPR_BRANCH_NAME);
  expect(hasCreateBranchCalled).toBe(false);
});

test('4.2 checkoutToIssue with creating local tracking branch', async () => {
  let checkoutBranch: string;
  let hasCreateBranchCalled = false;
  let gitFetchHasbeenCalled = false;
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    if (gitCommand.command === createBranchCmd.command){
      hasCreateBranchCalled = true;
      return T.of('');
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
    if (gitCommand.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_SORTED)
    }
    if (gitCommand.command === getRemoteBranchesCmd.command){
      return T.of(TEST_REMOTE_BRANCHES)
    }
    if (gitCommand.command === fetchCmd.command){
      gitFetchHasbeenCalled = true;
      return T.of('');
    }
  }
  await checkoutToIssue(mockExecuteWithChange)({
    issueUrl: '',
    title: '',
    labels: [],
    branchName: TEST_NOT_LOCAL_BUT_REMOTE_BRANCH,
  });
  expect(checkoutBranch).toBe(TEST_NOT_LOCAL_BUT_REMOTE_BRANCH);
  expect(gitFetchHasbeenCalled).toBe(true);
  expect(hasCreateBranchCalled).toBe(true);
});

test('4.3 checkoutToIssue with no local and remote error', async () => {
  let checkoutBranch: string;
  let hasCreateBranchCalled = false;
  const mockExecuteWithChange: ExecuteGitCommand = (gitCommand) => {
    if (gitCommand.command === "status"){
      return T.of(TEST_GIT_CLEAN_STATUS);
    }
    if (gitCommand.command === createBranchCmd.command){
      hasCreateBranchCalled = true;
      return T.of('');
    }
    if (gitCommand.command === "checkout"){
      checkoutBranch = gitCommand.argument;
      return T.of('');
    }
    if (gitCommand.command === getBranchesCmd.command){
      return T.of(TEST_BRANCH_SORTED)
    }
    if (gitCommand.command === getRemoteBranchesCmd.command){
      return T.of(TEST_REMOTE_BRANCHES)
    }
    if (gitCommand.command === fetchCmd.command){
      return T.of('');
    }
  }
  try{
    await checkoutToIssue(mockExecuteWithChange)({
      issueUrl: '',
      title: '',
      labels: [],
      branchName: TEST_NOT_LOCAL_BRANCH,
    });
  }catch(e){
    expect(e.type).toBe("NotExistingBranch")
    expect(hasCreateBranchCalled).toBe(false);
  }
});


