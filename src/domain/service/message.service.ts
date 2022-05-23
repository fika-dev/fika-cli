import { injectable } from "inversify";
import { Issue } from "../entity/issue.entity";
import { ErrorMessage, IMessageService,  } from "./i_message.service";
import chalk from 'chalk';



@injectable()
export class MessageService implements IMessageService{
  showSuccess(message: string): void {
    console.log(`\n\n🎉 ${message}\n\n`);
  }

  showConnectSuccess(){
    console.log(`
    🎉 Notion 과의 연결에 ${this._withGreenBoldChalk('성공')} 하였습니다!
    
       아래의 기능들을 사용해 보세요!
    
    1️⃣ Notion 페이지와 연결된 Github 이슈 생성하기 (TMI: ${this._withRedBoldChalk('ci')} 는 ${this._withRedBoldChalk('create issue')} 의 약자입니다)
    
    ${this._withYellowBoldChalk('fika')} ${this._withRedBoldChalk('ci')} [NOTION_PAGE_URL]
    
    
    2️⃣ Notion 페이지와 연결된 Github 풀리퀘스트 (PR) 생성하기 (TMI: ${this._withRedBoldChalk('cpr')} 은 ${this._withRedBoldChalk('create PR')} 의 약자입니다)
    
    ${this._withYellowBoldChalk('fika')} ${this._withRedBoldChalk('cpr')} [NOTION_PAGE_URL]
    `)
  }

  showConnecting(connectingUrl: string): void {
    console.log(`\n ${this._withYellowBoldChalk('fika')} 가 notion 과의 연결을 위해 아래 👇 웹주소에 접속합니다.\n\n ${connectingUrl}\n`);
  }

  showCreateIssueSuccess(issue: Issue): void {
    console.log(`🎉 이슈 생성에 성공하였습니다!  "${issue.title}"`);
    console.log('');
    console.log(`🟢 github issue url:  ${issue.issueUrl}`);
    console.log(`🟢 notion url:  ${issue.notionUrl}`);
    console.log('');
    console.log(`------------------------------------------------`);
    console.log('');
    console.log(`해당 이슈를 처리하기 위한 브랜치를 생성하시려면`);
    console.log(`아래 커맨드를 실행해 주세요.\n\n`);
    console.log(`git checkout -b feature/iss-${this._parseIssueNumber(issue.issueUrl!)}`);
    console.log('');
    console.log('');
  }

  showCreatePRSuccess(issue: Issue): void {
    console.log(`🎉 Pull Request (PR) 생성에 성공하였습니다!  "${issue.title}"`);
    console.log('');
    console.log(`🟢 github PR url:  ${issue.prUrl}`);
    console.log(`🟢 notion url:  ${issue.notionUrl}`);
    console.log('');
    console.log(`Github 에서 PR 을 병합한 이후에는`);
    console.log(`아래 커맨드를 실행해 주세요.\n\n`);
    console.log(`git checkout develop`);
    console.log(`git pull origin develop\n\n`);
  }
  showError(message: ErrorMessage): void {
    console.log(`🚨 오류가 발생했습니다.  "${message.code}"`);
    console.log('');
    console.log(message.message);
    if (message.guideUrl){
      console.log('');
      console.log(`🟢 아래 url 에서 더 많은 정보를 확인해 보세요`);
      console.log(`${message.guideUrl}`);
    }
    console.log('');
  }

  _parseIssueNumber(issueUrl: string): string{
    const fragments = issueUrl.split('/');
    return fragments[fragments.length-1]
  }

  private _withYellowBoldChalk = (word: string) => chalk.hex('#FAE232').bold(word)
  private _withGreenBoldChalk = (word: string) => chalk.hex('#61D835').bold(word)
  private _withRedBoldChalk = (word: string) => chalk.hex('#FF644E').bold(word)
}