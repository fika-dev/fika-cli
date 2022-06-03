
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { injectable } from "inversify";
import BaseException from "../value_object/exceptions/base_exception";
import { IErrorHandlingService } from "./i_error_handling.service";
import { IMessageService } from "./i_message.service";

@injectable()
export class ErrorHandlingService implements IErrorHandlingService{
  
  handle(exception: BaseException): void {
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
    if (exception.name === 'GH_CLI_NOT_LOGGEDIN'){
      messageService.showError({
        message: `github client 에 로그인이 되지 않았습니다.\n\n gh auth login\n\n 으로 login 을 해주세요.`, 
        code: exception.name,
        guideUrl: 'https://www.notion.so/haamki/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1',
      });
    }
    else if (exception.name === 'NO_GH_CLI'){
      messageService.showError({
        message: `github client 가 설치되지 않았습니다.\n설치 후 다시 시도해주세요.`, 
        code: exception.name,
        guideUrl: 'https://www.notion.so/haamki/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1',
      });
    }
    else if (exception.name === 'GhPrAlreadyExists'){
      messageService.showError({
        message: `이미 같은 branch 들에 대한 중복된 풀리퀘스트가 존재합니다.\n\n2 가지 해결방안)\n\n1. Github 에서 이미 존재하는 PR을 Close 후 다시 시도해주세요. \n2. 혹은 현재 branch 를 github 에 push 만 하여도, 이미 생성된 PR에 반영됩니다.`, 
        code: exception.name,
      });
    }
    else if (exception.name === 'NOTION_NOT_CONNECTED'){
      messageService.showError({
        message: `notion 이 fika 와 연결되지 않았습니다.\n\n fika connect \n\n 위의 커맨드를 통해 fika 와 notion 을 연결해주세요.`, 
        code: exception.name,
        guideUrl: 'https://www.notion.so/haamki/Fika-fika-cli-ce7bcef95ec1498eaf98ff15e1c759a1',
      });
    }
    else if (exception.name === 'WRONG_PROPERTY_TITLE_NAME'){
      messageService.showError({
        message: `업데이트 하고자 하는 Notion Page 의 title property 이름이 "title" 이 아닙니다.\n 해당 property 의 이름을 "title" 로 수정 후 다시 시도해주세요.`, 
        code: exception.name,
      });
    }
    else if (exception.name === 'WRONG_URI'){
      messageService.showError({
        message: `잘못된 형식의 URL 을 입력하였습니다.`, 
        code: exception.name,
      });
    }
    else if (exception.name === 'WRONG_UUID'){
      messageService.showError({
        message: `잘못된 형식의 UUID 를 입력하였습니다.`, 
        code: exception.name,
      });
    }
    else if (exception.name === 'NOT_AUTHENTICATED'){
      messageService.showError({
        message: `해당 기능을 사용하기 위해서는 로그인이 필요합니다.`, 
        code: exception.name,
      });
    }
    else{
      messageService.showError({
        message: exception.message, 
        code: exception.name,
      });
    }
  }

}