import { injectable } from "inversify";
import { Issue } from "../entity/issue.entity";
import { ErrorMessage, IMessageService,  } from "./i_message.service";
import chalk from 'chalk';



@injectable()
export class MessageService implements IMessageService{
  showInvaildEmail(email: string): void {
    console.log(`\nð¨ ìë ¥íì  \n${this._withRedBoldChalk(email)} ì \n\n`);
  }
  showGettingIssueForPR(): void {
    console.log(`\n\n${this._withYellowBoldChalk('íë¦¬íì¤í¸ PR')}ì ë§ë¤ê¸° ìí ì ë³´ë¥¼ Notion íì´ì§ë¡ ë¶í° ê°ì ¸ì¤ê³  ììµëë¤.\n\n`);
  }
  showGitPush(branchName: string): void {
    this._clear(); 
    console.log(`\n\n\níë¦¬íì¤í¸ PR ì ë§ë¤ê¸° ìí ì ë³´ë¥¼ Notion íì´ì§ë¡ ë¶í° ê°ì ¸ì¤ê¸° ${this._withGreenBoldChalk('ìë£')}
    
    ${this._withWhiteBoldChalk(branchName)} ë¸ëì¹ë¥¼ Github ì push íê³  ììµëë¤.\n\n`);
  }
  showCreatingPR(issue: Issue, branchName: string): void {
    this._clear(); 
    console.log(`\n\n\níë¦¬íì¤í¸ PR ì ë§ë¤ê¸° ìí ì ë³´ë¥¼ Notion íì´ì§ë¡ ë¶í° ê°ì ¸ì¤ê¸° ${this._withGreenBoldChalk('ìë£')}   
${branchName} ë¸ëì¹ë¥¼ Github ì push ${this._withGreenBoldChalk('ìë£')}    
"${this._withCyanBoldChalk(issue.title)}"
ì´ìì ê°ì ì´ë¦ì íë¦¬íì¤í¸ PR ì Github ì ìì±íê³  ììµëë¤.\n\n`);
  }
  showGettingIssue(): void {
    console.log(`\n\n${this._withYellowBoldChalk('ì´ì Issue')} ë¥¼ ë§ë¤ê¸° ìí ì ë³´ë¥¼ Notion íì´ì§ë¡ ë¶í° ê°ì ¸ì¤ê³  ììµëë¤.\n\n`);
  }
  showCreatingGitIssue(): void {
    this._clear();
    console.log(`\n\nì´ì Issue ë¥¼ ë§ë¤ê¸° ìí ì ë³´ë¥¼ Notion íì´ì§ë¡ ë¶í° ê°ì ¸ì¤ê¸° ${this._withGreenBoldChalk('ìë£')}
    
    ${this._withYellowBoldChalk('Github ì´ì Issue')} ìì± ì¤\n\n`);
  }
  showSuccess(message: string): void {
    console.log(`\n\nð ${message}\n\n`);
  }

  showConnectSuccess(){
    console.log(`
    ð Notion ê³¼ì ì°ê²°ì ${this._withGreenBoldChalk('ì±ê³µ')} íììµëë¤!
    
       ìëì ê¸°ë¥ë¤ì ì¬ì©í´ ë³´ì¸ì!

    
    1) Notion íì´ì§ì ì°ê²°ë Github ì´ì ìì±íê¸° (TMI: ${this._withBlueBoldChalk('ci')} ë ${this._withBlueBoldChalk('create issue')} ì ì½ììëë¤)
    
    ${this._withYellowBoldChalk('fika')} ${this._withBlueBoldChalk('ci')} [NOTION_PAGE_URL]
    
    
    
    2) Notion íì´ì§ì ì°ê²°ë Github íë¦¬íì¤í¸ (PR) ìì±íê¸° (TMI: ${this._withBlueBoldChalk('cpr')} ì ${this._withBlueBoldChalk('create PR')} ì ì½ììëë¤)
    
    ${this._withYellowBoldChalk('fika')} ${this._withBlueBoldChalk('cpr')} [NOTION_PAGE_URL]
    `)
  }

  showConnecting(connectingUrl: string): void {
    console.log(`\n ${this._withYellowBoldChalk('fika')} ê° notion ê³¼ì ì°ê²°ì ìí´ ìë ð ì¹ì£¼ìì ì ìí©ëë¤.\n\n ${connectingUrl}\n`);
  }

  showCreateIssueSuccess(issue: Issue): void {
    this._clear(); 
    console.log(`ð ì´ì ìì±ì ì±ê³µíììµëë¤!  "${this._withCyanBoldChalk(issue.title)}"`);
    console.log('');
    console.log(`ð¢ github issue url:  ${this._withYellowBoldChalk(issue.issueUrl)}`);
    console.log(`ð¢ notion url:  ${this._withBlueBoldChalk(issue.notionUrl)}`);
    console.log('');
    console.log(`------------------------------------------------`);
    console.log('');
    console.log(`í´ë¹ ì´ìë¥¼ ì²ë¦¬íê¸° ìí ë¸ëì¹ë¥¼ ìì±íìë ¤ë©´`);
    console.log(`ìë ì»¤ë§¨ëë¥¼ ì¤íí´ ì£¼ì¸ì.\n\n`);
    console.log(`${this._withWhiteBoldChalk('git checkout -b feature/iss-')}${this._withWhiteBoldChalk(this._parseIssueNumber(issue.issueUrl!))}`);
    console.log('');
    console.log('');


  }

  showCreatePRSuccess(issue: Issue): void {
    this._clear(); 
    console.log(`ð Pull Request (PR) ìì±ì ì±ê³µíììµëë¤!  "${this._withCyanBoldChalk(issue.title)}"`);
    console.log('');
    console.log(`ð¢ github PR url:  ${this._withYellowBoldChalk(issue.prUrl)}`);
    console.log(`ð¢ notion url:  ${this._withBlueBoldChalk(issue.notionUrl)}`);
    console.log('');
    console.log(`Github ìì PR ì ë³í©í ì´íìë`);
    console.log(`ìë ì»¤ë§¨ëë¥¼ ì¤íí´ ì£¼ì¸ì.\n\n`);
    console.log(`${this._withWhiteBoldChalk('git checkout develop')}`);
    console.log(`${this._withWhiteBoldChalk('git pull origin develop')}\n\n`);
  }
  showError(message: ErrorMessage): void {
    console.log(`ð¨ ì¤ë¥ê° ë°ìíìµëë¤.  "${message.code}"`);
    console.log('');
    console.log(message.message);
    if (message.guideUrl){
      console.log('');
      console.log(`ð¢ ìë url ìì ë ë§ì ì ë³´ë¥¼ íì¸í´ ë³´ì¸ì`);
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