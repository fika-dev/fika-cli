import { inject, injectable } from "inversify";
import { Issue } from "../entity/issue.entity";
import { ErrorMessage, IMessageService } from "./i_message.service";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { IConfigService } from "./i_config.service";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

interface TerminalColor {
  x: number;
  y: number;
}

const yellow: TerminalColor = {
  x: 93,
  y: 39,
};

const green: TerminalColor = {
  x: 92,
  y: 39,
};

const red: TerminalColor = {
  x: 91,
  y: 39,
};

const blue: TerminalColor = {
  x: 94,
  y: 39,
};

const cyan: TerminalColor = {
  x: 96,
  y: 39,
};

const white: TerminalColor = {
  x: 97,
  y: 39,
};

@injectable()
export class MessageService implements IMessageService {
  private configService: IConfigService;
  private rl: readline.Interface;
  constructor(@inject(SERVICE_IDENTIFIER.ConfigService) configService: IConfigService) {
    this.configService = configService;
    this.rl = readline.createInterface({ input, output });
  }
  start(): void {
    readline.cursorTo(output, 0, 0);
    readline.clearScreenDown(output);
  }
  close(): void {
    this.rl.close();
  }
  showWarning(message: string): void {
    this.rl.write(`Warning: ${this._withYellowBoldChalk(message)}`);
  }
  showCheckoutToExistingIssue(issue: Issue, branchName: string): void {
    this.rl.write(`\n해당 page 와 관련되어, 이미 생성된 issue 를 확인하였습니다.
“${this._withGreenBoldChalk(issue.title)}”\n
\n${this._withYellowBoldChalk(branchName)} 브랜치로 checkout 합니다.`);
  }
  showNotionPage(url: string): void {
    this.rl.write(`\n\nA new Notion was created : ${url}`);
  }
  showNeedUpdate(version: string): void {
    this.rl.write(`\n🚨 현재 최신버젼: \n${this._withGreenBoldChalk(
      version
    )} 으로 업데이트 후 사용 가능합니다. \n\n${this._withWhiteBoldChalk(
      `npm install -g fika@${version}`
    )}
    혹은 \n ${this._withWhiteBoldChalk(
      `yarn global add fika@${version}`
    )}\n으로 upgrade 후 사용해주시면 감사하겠습니다.\n\n`);
  }
  showRecommendUpdate(version: string): void {
    this.rl.write(`\n현재 최신버젼: \n${this._withGreenBoldChalk(
      version
    )} 으로 업데이트 하고자 하신다면, \n\n${this._withWhiteBoldChalk(
      `npm install -g fika@${version}`
    )}
    혹은 \n ${this._withWhiteBoldChalk(
      `yarn global add fika@${version}`
    )}\n으로 upgrade 후 사용해주시면 감사하겠습니다.\n\n`);
  }

  showInvaildEmail(email: string): void {
    this.rl.write(`\n🚨 입력하신 \n${this._withRedBoldChalk(email)} 은 \n\n`);
  }
  showGettingIssueForPR(): void {
    this.rl.write(
      `\n\n${this._withYellowBoldChalk(
        "풀리퀘스트 PR"
      )}을 만들기 위한 정보를 Notion 페이지로 부터 가져오고 있습니다.\n\n`
    );
  }
  showGitPush(branchName: string): void {
    this._clear();
    this.rl
      .write(`\n\n\n풀리퀘스트 PR 을 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this._withGreenBoldChalk(
      "완료"
    )}
    
    ${this._withWhiteBoldChalk(branchName)} 브랜치를 Github 에 push 하고 있습니다.\n\n`);
  }
  showCreatingPR(issue: Issue, branchName: string): void {
    this._clear();
    this.rl
      .write(`\n\n\n풀리퀘스트 PR 을 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this._withGreenBoldChalk(
      "완료"
    )}   
${branchName} 브랜치를 Github 에 push ${this._withGreenBoldChalk("완료")}    
"${this._withCyanBoldChalk(issue.title)}"
이슈와 같은 이름의 풀리퀘스트 PR 을 Github 에 생성하고 있습니다.\n\n`);
  }
  showGettingIssue(): void {
    this.rl.write(
      `\n\n${this._withYellowBoldChalk(
        "이슈 Issue"
      )} 를 만들기 위한 정보를 Notion 페이지로 부터 가져오고 있습니다.\n\n`
    );
  }
  showCreatingGitIssue(): void {
    this._clear();
    this.rl
      .write(`\n\n이슈 Issue 를 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this._withGreenBoldChalk(
      "완료"
    )}
    
    ${this._withYellowBoldChalk("Github 이슈 Issue")} 생성 중\n\n`);
  }
  showSuccess(message: string): void {
    this.rl.write(`\n\n🎉 ${message}\n\n`);
  }

  showConnectSuccess() {
    this.rl.write(`
    🎉 Notion 과의 연결에 ${this._withGreenBoldChalk("성공")} 하였습니다!
    
       아래의 기능들을 사용해 보세요!

    
    1) Notion 페이지와 연결된 Github 이슈 생성하기 (TMI: ${this._withBlueBoldChalk(
      "ci"
    )} 는 ${this._withBlueBoldChalk("create issue")} 의 약자입니다)
    
    ${this._withYellowBoldChalk("fika")} ${this._withBlueBoldChalk("ci")} [NOTION_PAGE_URL]
    
    
    
    2) Notion 페이지와 연결된 Github 풀리퀘스트 (PR) 생성하기 (TMI: ${this._withBlueBoldChalk(
      "cpr"
    )} 은 ${this._withBlueBoldChalk("create PR")} 의 약자입니다)
    
    ${this._withYellowBoldChalk("fika")} ${this._withBlueBoldChalk("cpr")} [NOTION_PAGE_URL]
    `);
  }

  showConnecting(connectingUrl: string): void {
    this.rl.write(
      `\n ${this._withYellowBoldChalk(
        "fika"
      )} 가 notion 과의 연결을 위해 아래 👇 웹주소에 접속합니다.\n\n ${connectingUrl}\n`
    );
  }

  showCreateIssueSuccess(issue: Issue): void {
    this._clear();
    const issueNumber = Issue.parseNumberFromUrl(issue.issueUrl!);
    const issueBranch = this.configService.getIssueBranch(issueNumber);
    this.rl.write(`🎉 이슈 생성에 성공하였습니다!  "${this._withCyanBoldChalk(issue.title)}"`);
    this.rl.write("");
    this.rl.write(`🟢 github issue url:  ${this._withYellowBoldChalk(issue.issueUrl)}`);
    this.rl.write(`🟢 notion url:  ${this._withBlueBoldChalk(issue.notionUrl)}`);
    this.rl.write("");
    this.rl.write(`------------------------------------------------`);
    this.rl.write("");
    this.rl.write(`해당 이슈를 처리하기 위한 브랜치를 생성하시려면`);
    this.rl.write(`아래 커맨드를 실행해 주세요.\n\n`);
    this.rl.write(`${this._withWhiteBoldChalk(`git checkout -b ${issueBranch}`)}`);
    this.rl.write("");
    this.rl.write("");
  }

  showCreatePRSuccess(issue: Issue): void {
    const baseBranch = this.configService.getBaseBranch();
    this._clear();
    this.rl.write(
      `🎉 Pull Request (PR) 생성에 성공하였습니다!  "${this._withCyanBoldChalk(issue.title)}"`
    );
    this.rl.write("");
    this.rl.write(`🟢 github PR url:  ${this._withYellowBoldChalk(issue.prUrl)}`);
    this.rl.write(`🟢 notion url:  ${this._withBlueBoldChalk(issue.notionUrl)}`);
    this.rl.write("");
    this.rl.write(`Github 에서 PR 을 병합한 이후에는`);
    this.rl.write(`아래 커맨드를 실행해 주세요.\n\n`);
    this.rl.write(`${this._withWhiteBoldChalk(`git checkout ${baseBranch}`)}`);
    this.rl.write(`${this._withWhiteBoldChalk(`git pull origin ${baseBranch}`)}\n\n`);
  }
  showError(message: ErrorMessage): void {
    this.rl.write(`🚨 오류가 발생했습니다.  "${message.code}"`);
    this.rl.write("");
    this.rl.write(message.message);
    if (message.guideUrl) {
      this.rl.write("");
      this.rl.write(`🟢 아래 url 에서 더 많은 정보를 확인해 보세요`);
      this.rl.write(`${message.guideUrl}`);
    }
    this.rl.write("");
  }

  _parseIssueNumberFromUrl(issueUrl: string): string {
    const fragments = issueUrl.split("/");
    return fragments[fragments.length - 1];
  }

  private _withYellowBoldChalk = (word: string) => this._colorize(yellow, word);
  private _withGreenBoldChalk = (word: string) => this._colorize(green, word);
  private _withRedBoldChalk = (word: string) => this._colorize(red, word);
  private _withBlueBoldChalk = (word: string) => this._colorize(blue, word);
  private _withCyanBoldChalk = (word: string) => this._colorize(cyan, word);
  private _withWhiteBoldChalk = (word: string) => this._colorize(white, word);

  private _colorize = (color: TerminalColor, text) => {
    return `\x1b[${color.x}m${text}\x1b[${color.y}m`;
  };

  private _clear = () => {
    const lines = process.stdout.rows;
    for (let index = 0; index < lines; index++) {
      readline.cursorTo(output, 0, 0);
      readline.clearLine(output, 0);
    }
  };
}
