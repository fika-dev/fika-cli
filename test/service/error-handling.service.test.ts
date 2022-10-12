import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { DomainError } from "@/domain/general/general.types";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
import { IMessageService } from "@/domain/service/i_message.service";
import * as T from "fp-ts/Task";
import { TEST_GET_ABORT_MERGE_SUCCESS_OUTPUT, TEST_HTTPS_GITHUB_REPO } from "test/test-constants";
import { spyWithMock } from "test/test-utils";
const errorHandlingService = container.get<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService);
const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);

beforeAll(async () => {
  jest.restoreAllMocks();
});

beforeEach(async()=>{
  
});

afterEach(async ()=>{
  

})

afterAll(() => {
  
});

describe("1. test handling ValidationError", () => {
  test("1.1. test handling ValidationError of NotIssueNumberError", async () => {
    const error = {
      type: "ValidationError",
      subType:"NotIssueNumberError",
      value: NaN,
    } as DomainError;
    const spy = jest.spyOn(messageService, "showError").mockImplementationOnce(() => undefined);
    errorHandlingService.handleError(error);
    expect(spy).toHaveBeenCalledWith({
      message: `Validation for a given value failed. ${error.subType}: ${error.value}`,
      code: error.subType,
      guideUrl: "https://www.notion.so/fika/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});


describe("2. test handling GitError", () => {
  test("2.1. test handling GitErrorNoRemoteBranch", async () => {
    const exception = {
      type: "GitError",
      subType: "GitErrorNoRemoteBranch",
      value: "feature/iss/$1",
    } as DomainError;
    const spy = jest.spyOn(messageService, "showError").mockImplementationOnce(() => undefined);
    errorHandlingService.handleError(exception);
    expect(spy).toHaveBeenCalledWith({
      message: `failed to pull because the ${exception.value} branch could not be found from remote`,
      code: exception.subType,
      guideUrl: "https://fikadev.notion.site/GitErrorNoRemoteBranch-59ab604806c540ea81b48c2545098a57",
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("2.2. test handling GitErrorMergeConflict with aborting merge", async () => {
    const exception = {
      type: "GitError",
      subType: "GitErrorMergeConflict",
      value: "feature/iss/$1",
    } as DomainError;
    const spy1 = jest.spyOn(messageService, "showError").mockImplementationOnce(() => undefined);
    const spy2 = jest.spyOn(promptService, "confirmAction").mockImplementationOnce(() => Promise.resolve(false));
    const spy3 = jest.spyOn(messageService, "showSuccess").mockImplementationOnce((m) => undefined);
    spyWithMock(()=>T.of(TEST_GET_ABORT_MERGE_SUCCESS_OUTPUT));
    await errorHandlingService.handleError(exception);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith("Do you wanna resolve this conflict right now? (y or n)");
    expect (spy3).toHaveBeenCalledWith("We canceled the merge process.");
  });

  test("2.3. test handling GitErrorMergeConflict without aborting merge", async () => {
    const exception = {
      type: "GitError",
      subType: "GitErrorMergeConflict",
      value: "feature/iss/$1",
    } as DomainError;
    const spy1 = jest.spyOn(messageService, "showError").mockImplementationOnce(() => undefined);
    const spy2 = jest.spyOn(promptService, "confirmAction").mockImplementationOnce(() => Promise.resolve(true));
    const spy3 = jest.spyOn(messageService, "showSuccess").mockImplementationOnce((m) => undefined);
    spyWithMock(()=>{throw new Error()});
    await errorHandlingService.handleError(exception);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith("Do you wanna resolve this conflict right now? (y or n)");
    expect (spy3).toHaveBeenCalledWith("Please resolve the conflict and run the command again.");
  });
});


describe("3. test handling UserError", () => {
  test("3.1. test handling UserCancel", async () => {
    const error = {
      type: "UserError",
      subType:"UserCancel",
    } as DomainError;
    const spy = jest.spyOn(messageService, "showSuccess").mockImplementationOnce(() => undefined);
    jest.spyOn(messageService, "showError").mockImplementationOnce(() => {throw new Error()});
    await errorHandlingService.handleError(error);
    expect(spy).toHaveBeenCalledWith("User canceled the process.");
  });
});

describe("4. test handling BackendError", () => {
  test("4.1. test handling BackendError", async () => {
    const error = {
      type: "BackendError",
      subType:"IssueRecordNotFound",
      value: {
        issueNumber: 11,
        gitRepoUrl: TEST_HTTPS_GITHUB_REPO,
      },
    } as DomainError;
    jest.restoreAllMocks();
    const spy = jest.spyOn(messageService, "showError").mockImplementationOnce(() => undefined);
    await errorHandlingService.handleError(error);
    expect(spy).toHaveBeenCalledWith({
      message: `The issue with number: ${error.value.issueNumber} has not found with the given repo ${error.value.gitRepoUrl}`,
      code: error.subType,
      guideUrl: "https://www.notion.so/fikadev/IssueRecordNotFound-1427132e42c4468d86c996b2c5dfc8c0",
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});


