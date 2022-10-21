import { pullAction } from "@/command/pull/pull.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES } from "@/config/constants/messages";
import container from "@/config/ioc_config";
import { getCurrentBranchCmd, pullFromCmd, statusCmd } from "@/domain/git-command/git-command.values";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import * as T from 'fp-ts/Task';
import { TEST_GIT_PULL_CONFLICT_OUTPUT, TEST_GIT_PULL_UNRESOLVED_MERGE_OUTPUT_2, TEST_GIT_PULL_UPDATED_OUTPUT, TEST_GIT_STATUS_WITH_STAGED } from "test/test-constants";
import { clearLocalConfig, clearTestFikaPath, spyWithMock } from "test/test-utils";

const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);

afterEach(async ()=>{
  jest.clearAllMocks();
  clearLocalConfig(process.env.TESTING_REPO_PATH);
  await messageService.endWaiting();
});

beforeEach(()=>{
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

beforeAll(() => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
});

afterAll(async () => {
  clearTestFikaPath(process.env.TESTING_PATH);
  clearLocalConfig(process.env.TESTING_REPO_PATH);
  
});


test('1.test pullAction when successfuly merged', async () => { 
  spyWithMock((cmd) => {
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_UPDATED_OUTPUT);
    }
    if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }else{
      return T.of('');
    }
  });
  
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
  await pullAction();
  expect(spy).toBeCalledWith('Synced from origin develop');
});


test('2.test pullAction something wrong', async () => { 
  spyWithMock((cmd) => {
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_CONFLICT_OUTPUT);
    }
    if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }else{
      return T.of('');
    }
  });
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
  try{
    await pullAction();
    expect(true).toEqual(false);
  }catch(e){
    expect(e.subType).toEqual('GitErrorMergeConflict');
  }
});


test('2.test pullAction merge conflict', async () => { 
  spyWithMock((cmd) => {
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_CONFLICT_OUTPUT);
    }
    if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }else{
      return T.of('');
    }
  });
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
  try{
    await pullAction();
    expect(true).toEqual(false);
  }catch(e){
    expect(e.subType).toEqual('GitErrorMergeConflict');
  }
});

test('3.test pullAction something wrong unknown reason', async () => { 
  spyWithMock((cmd) => {
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_UNRESOLVED_MERGE_OUTPUT_2);
    }
    if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }else{
      return T.of('');
    }
  });
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const spy = jest.spyOn(messageService, 'showSuccess').mockImplementation(() => { });
  try{
    await pullAction();
    expect(true).toEqual(false);
  }catch(e){
    expect(e.subType).toEqual('NotMatchedPullOutput');
  }
});

test('4.test pullAction continue with uncommited changes', async () => { 

  
  spyWithMock((cmd) => {
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_UPDATED_OUTPUT);
    }
    else if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }else if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }else{
      return T.of('');
    }
  });
  const spy = jest.spyOn(promptService, 'confirmAction').mockImplementation((message: string) => Promise.resolve(true));
  await pullAction();
  expect(spy).toHaveBeenCalledWith(MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES);
});



test('5.test pullAction refuse to continue', async () => { 
  spyWithMock((cmd) => {
    if(cmd.command === pullFromCmd.command){
      return T.of(TEST_GIT_PULL_UPDATED_OUTPUT);
    }
    else if (cmd.command === getCurrentBranchCmd.command){
      return T.of('develop');
    }else if (cmd.command === statusCmd.command){
      return T.of(TEST_GIT_STATUS_WITH_STAGED);
    }else{
      return T.of('');
    }
  });
  const spy = jest.spyOn(promptService, 'confirmAction').mockImplementation((message: string) => Promise.resolve(false));
  try{
    await pullAction();
    expect(true).toEqual(false);
  }catch(e){
    expect(e.subType).toEqual('UserCancel');
  }
});