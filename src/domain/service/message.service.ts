import { injectable } from "inversify";
import { Issue } from "../entity/issue.entity";
import { ErrorMessage, IMessageService,  } from "./i_message.service";
import chalk from 'chalk';



@injectable()
export class MessageService implements IMessageService{
  showInvaildEmail(email: string): void {
    console.log(`\n🚨 입력하신 \n${this._withRedBoldChalk(email)} 은 \n\n`);
  }
  showGettingIssueForPR(): void {
    console.log(`\n\n${this._withYellowBoldChalk('풀리퀘스트 PR')}을 만들기 위한 정보를 Notion 페이지로 부터 가져오고 있습니다.\n\n`);
  }
  showGitPush(branchName: string): void {
    this._clear(); 
    console.log(`\n\n\n풀리퀘스트 PR 을 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this._withGreenBoldChalk('완료')}
    
    ${this._withWhiteBoldChalk(branchName)} 브랜치를 Github 에 push 하고 있습니다.\n\n`);
  }
  showCreatingPR(issue: Issue, branchName: string): void {
    this._clear(); 
    console.log(`\n\n\n풀리퀘스트 PR 을 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this._withGreenBoldChalk('완료')}   
${branchName} 브랜치를 Github 에 push ${this._withGreenBoldChalk('완료')}    
"${this._withCyanBoldChalk(issue.title)}"
이슈와 같은 이름의 풀리퀘스트 PR 을 Github 에 생성하고 있습니다.\n\n`);
  }
  showGettingIssue(): void {
    console.log(`\n\n${this._withYellowBoldChalk('이슈 Issue')} 를 만들기 위한 정보를 Notion 페이지로 부터 가져오고 있습니다.\n\n`);
  }
  showCreatingGitIssue(): void {
    this._clear();
    console.log(`\n\n이슈 Issue 를 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this._withGreenBoldChalk('완료')}
    
    ${this._withYellowBoldChalk('Github 이슈 Issue')} 생성 중\n\n`);
  }
  showSuccess(message: string): void {
    console.log(`\n\n🎉 ${message}\n\n`);
  }

  showConnectSuccess(){
    console.log(`
    🎉 Notion 과의 연결에 ${this._withGreenBoldChalk('성공')} 하였습니다!
    
       아래의 기능들을 사용해 보세요!

    
    1) Notion 페이지와 연결된 Github 이슈 생성하기 (TMI: ${this._withBlueBoldChalk('ci')} 는 ${this._withBlueBoldChalk('create issue')} 의 약자입니다)
    
    ${this._withYellowBoldChalk('fika')} ${this._withBlueBoldChalk('ci')} [NOTION_PAGE_URL]
    
    
    
    2) Notion 페이지와 연결된 Github 풀리퀘스트 (PR) 생성하기 (TMI: ${this._withBlueBoldChalk('cpr')} 은 ${this._withBlueBoldChalk('create PR')} 의 약자입니다)
    
    ${this._withYellowBoldChalk('fika')} ${this._withBlueBoldChalk('cpr')} [NOTION_PAGE_URL]
    `)
  }

  showConnecting(connectingUrl: string): void {
    console.log(`\n ${this._withYellowBoldChalk('fika')} 가 notion 과의 연결을 위해 아래 👇 웹주소에 접속합니다.\n\n ${connectingUrl}\n`);
  }

  showCreateIssueSuccess(issue: Issue): void {
    this._clear(); 
    console.log(`🎉 이슈 생성에 성공하였습니다!  "${this._withCyanBoldChalk(issue.title)}"`);
    console.log('');
    console.log(`🟢 github issue url:  ${this._withYellowBoldChalk(issue.issueUrl)}`);
    console.log(`🟢 notion url:  ${this._withBlueBoldChalk(issue.notionUrl)}`);
    console.log('');
    console.log(`------------------------------------------------`);
    console.log('');
    console.log(`해당 이슈를 처리하기 위한 브랜치를 생성하시려면`);
    console.log(`아래 커맨드를 실행해 주세요.\n\n`);
    console.log(`${this._withWhiteBoldChalk('git checkout -b feature/iss-')}${this._withWhiteBoldChalk(this._parseIssueNumber(issue.issueUrl!))}`);
    console.log('');
    console.log('');


  }

  showCreatePRSuccess(issue: Issue): void {
    this._clear(); 
    console.log(`🎉 Pull Request (PR) 생성에 성공하였습니다!  "${this._withCyanBoldChalk(issue.title)}"`);
    console.log('');
    console.log(`🟢 github PR url:  ${this._withYellowBoldChalk(issue.prUrl)}`);
    console.log(`🟢 notion url:  ${this._withBlueBoldChalk(issue.notionUrl)}`);
    console.log('');
    console.log(`Github 에서 PR 을 병합한 이후에는`);
    console.log(`아래 커맨드를 실행해 주세요.\n\n`);
    console.log(`${this._withWhiteBoldChalk('git checkout develop')}`);
    console.log(`${this._withWhiteBoldChalk('git pull origin develop')}\n\n`);
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
  private _withBlueBoldChalk = (word: string) => chalk.hex('#00A2FF').bold(word)
  private _withCyanBoldChalk = (word: string) => chalk.hex('#18E7CF').bold(word)
  private _withWhiteBoldChalk = (word: string) => chalk.hex('#FFFFFF').bold(word)

  private _clear = ()=>{
    const lines = process.stdout.rows;
    for (let index = 0; index < lines; index++) {
      process.stdout.clearLine(0);
    } 
  }
}