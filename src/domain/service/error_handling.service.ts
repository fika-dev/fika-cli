import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import { injectable } from "inversify";
import { DomainError } from "../general/general.types";
import { abortMerge } from "../git-command/command.functions";
import BaseException from "../value_object/exceptions/base_exception";
import { NO_BASE_BRANCH_MESSAGE } from "../value_object/exceptions/no_base_branch.vo";
import { NO_GIT_REMOTE_MESSAGE } from "../value_object/exceptions/no_git_remote.vo";
import { WRONG_TAG_FORMAT } from "../value_object/exceptions/wrong_tag_format";
import { IPromptService } from "./i-prompt.service";
import { IErrorHandlingService } from "./i_error_handling.service";
import { IMessageService } from "./i_message.service";

@injectable()
export class ErrorHandlingService implements IErrorHandlingService {
  async handleError(exception: DomainError): Promise<void> {
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
    if (exception.type === "ValidationError") {
      messageService.showError({
        message: `Validation for a given value failed. ${exception.subType}: ${exception.value}`,
        code: exception.subType,
        guideUrl: "https://www.notion.so/fika/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
      });
      return;
    }
    if (exception.type === "GitError") {
      if (exception.subType === "GitErrorNoRemoteBranch") {
        messageService.showError({
          message: `failed to pull because the ${exception.value} branch could not be found from remote`,
          code: exception.subType,
          guideUrl:
            "https://fikadev.notion.site/GitErrorNoRemoteBranch-59ab604806c540ea81b48c2545098a57",
        });
        return;
      }
      if (exception.subType === "GitErrorFailedToPull") {
        messageService.showError({
          message: `failed to pull on the branch: ${exception.value}`,
          code: exception.subType,
          guideUrl:
            "https://www.notion.so/fikadev/GitErrorFailedToPull-419a3e2819814c48b35af9a67beb51e6",
        });
        return;
      }
      if (exception.subType === "GitErrorMergeConflict") {
        const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
        messageService.showError({
          message: "git pull has failed becaus of merge conflict to resolve manually",
          code: exception.subType,
          guideUrl:
            "https://fikadev.notion.site/GitErrorMergeConflict-1cd3cda89e0040a5a6791b9ebe61fa37",
        });
        const answer = await promptService.confirmAction(
          "Do you wanna resolve this conflict right now? (y or n)"
        );
        if (!answer) {
          const commanderService = container.get<ICommanderService>(
            SERVICE_IDENTIFIER.CommanderService
          );
          await abortMerge(commanderService.executeGitCommand)();
          await messageService.showSuccess("We canceled the merge process.");
        } else {
          await messageService.showSuccess(
            "Please resolve the conflict and run the command again."
          );
        }
        return;
      }
      if (exception.subType === "NotExistingBranch") {
        messageService.showError({
          message: `The branch: ${exception.value} does not exist`,
          code: exception.subType,
          guideUrl:
            "https://fikadev.notion.site/NotExistingBranch-0328e27181164c5789a8fbed50c924e9",
        });
        return;
      }
      if (exception.subType === "NoCurrentBranch") {
        messageService.showError({
          message: "Can not find any branches from this repo\nPlease check your git status",
          code: exception.subType,
          guideUrl: "https://fikadev.notion.site/NoCurrentBranch-1318a1bdddaa40c4ad38fb5d9894a298",
        });
        return;
      }
      if (exception.subType === "NoLocalFeatureBranch") {
        messageService.showError({
          message: "Can not find any local feature branches from this repo",
          code: exception.subType,
          guideUrl:
            "https://www.notion.so/fikadev/NoLocalFeatureBranch-91f8b7dcb88146cf8cc5fe9bc0bbf815",
        });
        return;
      }
      if (exception.subType === "NotMatchedPullOutput") {
        messageService.showError({
          message: `The output from git pull is not matched with any expected output\n${exception.value}`,
          code: exception.subType,
          guideUrl:
            "https://www.notion.so/fikadev/NotMatchedPullOutput-1d16ad886bb348138e86812b22aed554",
        });
        return;
      }
      if (exception.subType === "ErrorMessageFound") {
        messageService.showError({
          message: `The output from git command contains error message\n${exception.value}`,
          code: exception.subType,
          guideUrl:
            "https://www.notion.so/fikadev/ErrorMessageFound-c5f66fadbd4f439bb5a85c8353dda4e5",
        });
        return;
      }
      messageService.showError({
        message: "Unknown Git Error",
        code: exception.subType,
      });
      return;
    }
    if (exception.type === "UserError") {
      if (exception.subType === "UserCancel") {
        await messageService.showSuccess("User canceled the process.");
        return;
      }
    }
    if (exception.type === "BackendError") {
      if (exception.subType === "IssueRecordNotFound") {
        messageService.showError({
          message: `The issue with number: ${exception.value.issueNumber} has not found with the given repo ${exception.value.gitRepoUrl}`,
          code: exception.subType,
          guideUrl:
            "https://www.notion.so/fikadev/IssueRecordNotFound-1427132e42c4468d86c996b2c5dfc8c0",
        });
        return;
      }
      if (exception.subType === "NoBranchNameInIssueRecord") {
        messageService.showError({
          message: `Branch name is empty from the issue record with the issue: ${exception.value}`,
          code: exception.subType,
          guideUrl:
            "https://www.notion.so/fikadev/NoBranchNameInIssueRecord-99bb36772b734cd1907372eeca68d3dc",
        });
        return;
      }
      return;
    }
    messageService.showError({
      message: "Unknown Error",
      code: exception.type,
    });
  }
  handle(exception: BaseException): void {
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
    messageService.endWaiting();
    if (exception.name === "GH_CLI_NOT_LOGGEDIN") {
      messageService.showError({
        message: `github client 에 로그인이 되지 않았습니다.\n\n gh auth login\n\n 으로 login 을 해주세요.`,
        code: exception.name,
        guideUrl: "https://www.notion.so/fika/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
      });
    } else if (exception.name === "NO_GH_CLI") {
      messageService.showError({
        message: `github client 가 설치되지 않았습니다.\n설치 후 다시 시도해주세요.`,
        code: exception.name,
        guideUrl: "https://www.notion.so/fika/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
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
        guideUrl: "https://www.notion.so/fika/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1",
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
