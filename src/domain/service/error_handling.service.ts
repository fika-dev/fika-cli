import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { injectable } from "inversify";
import { DomainError } from "../general/general.types";
import BaseException from "../value_object/exceptions/base_exception";
import { NO_BASE_BRANCH_MESSAGE } from "../value_object/exceptions/no_base_branch.vo";
import { NO_GIT_REMOTE_MESSAGE } from "../value_object/exceptions/no_git_remote.vo";
import { WRONG_TAG_FORMAT } from "../value_object/exceptions/wrong_tag_format";
import { IErrorHandlingService } from "./i_error_handling.service";
import { IMessageService } from "./i_message.service";

@injectable()
export class ErrorHandlingService implements IErrorHandlingService {
  handleError(exception: DomainError): void {
    throw exception;
  }
  handle(exception: BaseException): void {
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
    messageService.endWaiting();
    if (exception.name === "GH_CLI_NOT_LOGGEDIN") {
      messageService.showError({
        message: `github client 에 로그인이 되지 않았습니다.\n\n gh auth login\n\n 으로 login 을 해주세요.`,
        code: exception.name,
        guideUrl: "https://www.notion.so/haamki/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
      });
    } else if (exception.name === "NO_GH_CLI") {
      messageService.showError({
        message: `github client 가 설치되지 않았습니다.\n설치 후 다시 시도해주세요.`,
        code: exception.name,
        guideUrl: "https://www.notion.so/haamki/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
      });
    } else if (exception.name === "GhPrAlreadyExists") {
      messageService.showWarning(
        "PR for same issue aleary exists. \n(Instead Fika just pushed recent commits)"
      );
      // messageService.showError({
      //   message: `이미 같은 branch 들에 대한 중복된 풀리퀘스트가 존재합니다.\n\n2 가지 해결방안)\n\n1. Github 에서 이미 존재하는 PR을 Close 후 다시 시도해주세요. \n2. 혹은 현재 branch 를 github 에 push 만 하여도, 이미 생성된 PR에 반영됩니다.`,
      //   code: exception.name,
      // });
    } else if (exception.name === "GhNoCommits") {
      messageService.showError({
        message: `\n\n타겟팅하고 있는 브랜치 와 현재 push 하고 있는 브랜치 사이에 업데이트할 커밋이 없습니다.\n제출하지 않은 Commit 이 있는지 확인해보세요.\n\n`,
        code: exception.name,
      });
    } else if (exception.name === "WORKSPACE_NOT_CONNECTED") {
      messageService.showError({
        message: `Workspace is not connected. Please follow below guide.`,
        code: exception.name,
        guideUrl: "https://www.notion.so/haamki/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
      });
    } else if (exception.name === "WRONG_PROPERTY_TITLE_NAME") {
      messageService.showError({
        message: `업데이트 하고자 하는 Notion Page 의 title property 이름이 "title" 이 아닙니다.\n 해당 property 의 이름을 "title" 로 수정 후 다시 시도해주세요.`,
        code: exception.name,
      });
    } else if (exception.name === "WRONG_URI") {
      messageService.showError({
        message: `잘못된 형식의 URL 을 입력하였습니다.`,
        code: exception.name,
      });
    } else if (exception.name === "WRONG_UUID") {
      messageService.showError({
        message: `잘못된 형식의 UUID 를 입력하였습니다.`,
        code: exception.name,
      });
    } else if (exception.name === "NOT_AUTHENTICATED") {
      messageService.showError({
        message: `로그인 정보가 올바르지 않습니다.`,
        code: exception.name,
      });
    } else if (exception.name === "NotOnline") {
      messageService.showError({
        message: `\n\nFika 서버에 접속이 어렵습니다. \n 인터넷 연결을 확인 후 다시 시도해주세요.\n\n`,
        code: exception.name,
      });
    } else if (exception.name === WRONG_TAG_FORMAT) {
      messageService.showError({
        message: `\n\nYou entered tag version in wrong format \n Please type in like (e.g. 3.0.1) \n\n`,
        code: exception.name,
      });
    } else if (exception.name === NO_BASE_BRANCH_MESSAGE) {
      messageService.showError({
        message: `\n\nNo base branch is found \nPlease check base branch is well configured (e.g. develop branch) \n\n`,
        code: exception.name,
      });
    } else if (exception.name === NO_GIT_REMOTE_MESSAGE) {
      messageService.showError({
        message: `\n\nGit remotes are not found \nPlease set remotes like (git remote add origin <REMOTE_REPO>) \n\n`,
        code: exception.name,
      });
    } else if (exception.name === NO_BASE_BRANCH_MESSAGE) {
      messageService.showError({
        message: `\n\nNo base branch is found \nPlease check base branch is well configured (e.g. develop branch) \n\n`,
        code: exception.name,
      });
    } else if (exception.name === "NotionPageNotFound") {
      messageService.showError({
        message: `\nCould not find Notion Page with given URL\n`,
        code: exception.name,
      });
    } else if (exception.name === "NothingToCommit") {
      messageService.showError({
        message: `\nThere is nothing to commit\n`,
        code: exception.name,
      });
    } else if (exception.name === "NoRemoteBranch") {
      messageService.showError({
        message: `\nNo remote branch was found\n`,
        code: exception.name,
      });
    } else if (exception.name === "UserStopped:UnstagedChange") {
      messageService.showWarning("Stopped becasue of unstaged changes");
    } else if (exception.name === "GitError:MergeConflict") {
      messageService.showWarning("There is merge conflict. Try again after resolving conflict");
    } else if (exception.name === "GitError:RemoteConflict") {
      messageService.showWarning(
        "There is conflict between remote and local. Cannot pull from remote"
      );
    } else if (exception.name === "GitError:RemoteConflict") {
      messageService.showWarning("There is no such branch in remote repo");
    } else {
      messageService.showError({
        message: exception.message,
        code: exception.name,
      });
    }
  }
}
