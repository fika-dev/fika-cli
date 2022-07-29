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
  private timer: NodeJS.Timer | undefined = undefined;
  constructor(@inject(SERVICE_IDENTIFIER.ConfigService) configService: IConfigService) {
    this.configService = configService;
    this.rl = readline.createInterface({ input, output });
  }

  start(): void {}
  close(): void {
    this.rl.write("\r");
    this.rl.close();
  }
  showWaiting(message: string): void {
    const waitingFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    var i: number = 0;
    this.timer = setInterval(() => {
      readline.clearLine(output, 0, () => {
        readline.cursorTo(output, 0, undefined, () => {
          this.rl.write(`🧘 ${waitingFrames[i % 10]}${message} ${".".repeat(i % 6)}`);
        });
      });
      i += 1;
    }, 300);
  }
  endWaiting(): void {
    if (this.timer) {
      clearInterval(this.timer);
      readline.clearLine(output, 0, () => {
        readline.cursorTo(output, 0);
      });
    }
  }
  showSuccess(message: string, subMessage?: string, link?: string): void {
    this.rl.write(`${this.withGreenBoldChalk(`✅ ${message}`)}\n`);
    if (subMessage) {
      this.rl.write(`${this.withWhiteBoldChalk(` ${subMessage}`)}\n`);
    }
    if (link) {
      this.rl.write(` ${this.withYellowUnderlineChalk(`${link}`)}\n`);
    }
  }
  showWarning(message: string): void {
    this.rl.write(this.withYellowBoldChalk(`Warning: ${message}\n`));
  }
  showError(message: ErrorMessage): void {
    this.rl.write(`🚨 ${this.withRedBoldChalk(`Error: ${message.code}`)}\n`);
    this.rl.write(this.withRedBoldChalk(`${message.message}\n`));
    if (message.guideUrl) {
      this.rl.write(`🟢 아래 url 에서 더 많은 정보를 확인해 보세요\n`);
      this.rl.write(`${message.guideUrl}\n`);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  showCheckoutToExistingIssue(issue: Issue, branchName: string): void {
    this.rl.write(`\n해당 page 와 관련되어, 이미 생성된 issue 를 확인하였습니다.
“${this.withGreenBoldChalk(issue.title)}”\n
\n${this.withYellowBoldChalk(branchName)} 브랜치로 checkout 합니다.`);
  }
  showNotionPage(url: string): void {
    this.rl.write(`\n\nA new Notion was created : ${url}`);
  }
  showNeedUpdate(version: string): void {
    this.rl.write(`\n🚨 현재 최신버젼: \n${this.withGreenBoldChalk(
      version
    )} 으로 업데이트 후 사용 가능합니다. \n\n${this.withWhiteBoldChalk(
      `npm install -g fika@${version}`
    )}
    혹은 \n ${this.withWhiteBoldChalk(
      `yarn global add fika@${version}`
    )}\n으로 upgrade 후 사용해주시면 감사하겠습니다.\n\n`);
  }
  showRecommendUpdate(version: string): void {
    this.rl.write(`\n현재 최신버젼: \n${this.withGreenBoldChalk(
      version
    )} 으로 업데이트 하고자 하신다면, \n\n${this.withWhiteBoldChalk(
      `npm install -g fika@${version}`
    )}
    혹은 \n ${this.withWhiteBoldChalk(
      `yarn global add fika@${version}`
    )}\n으로 upgrade 후 사용해주시면 감사하겠습니다.\n\n`);
  }

  showInvaildEmail(email: string): void {
    this.rl.write(`\n🚨 입력하신 \n${this.withRedBoldChalk(email)} 은 \n\n`);
  }
  showGettingIssueForPR(): void {
    this.rl.write(
      `\n\n${this.withYellowBoldChalk(
        "풀리퀘스트 PR"
      )}을 만들기 위한 정보를 Notion 페이지로 부터 가져오고 있습니다.\n\n`
    );
  }
  showGitPush(branchName: string): void {
    this._clear();
    this.rl
      .write(`\n\n\n풀리퀘스트 PR 을 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this.withGreenBoldChalk(
      "완료"
    )}
    
    ${this.withWhiteBoldChalk(branchName)} 브랜치를 Github 에 push 하고 있습니다.\n\n`);
  }
  showCreatingPR(issue: Issue, branchName: string): void {
    this._clear();
    this.rl
      .write(`\n\n\n풀리퀘스트 PR 을 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this.withGreenBoldChalk(
      "완료"
    )}   
${branchName} 브랜치를 Github 에 push ${this.withGreenBoldChalk("완료")}    
"${this.withCyanBoldChalk(issue.title)}"
이슈와 같은 이름의 풀리퀘스트 PR 을 Github 에 생성하고 있습니다.\n\n`);
  }
  showGettingIssue(): void {
    this.rl.write(
      `\n\n${this.withYellowBoldChalk(
        "이슈 Issue"
      )} 를 만들기 위한 정보를 Notion 페이지로 부터 가져오고 있습니다.\n\n`
    );
  }
  showCreatingGitIssue(): void {
    this._clear();
    this.rl
      .write(`\n\n이슈 Issue 를 만들기 위한 정보를 Notion 페이지로 부터 가져오기 ${this.withGreenBoldChalk(
      "완료"
    )}
    
    ${this.withYellowBoldChalk("Github 이슈 Issue")} 생성 중\n\n`);
  }

  showConnectSuccess() {
    this.rl.write(`
    🎉 Notion 과의 연결에 ${this.withGreenBoldChalk("성공")} 하였습니다!
    
       아래의 기능들을 사용해 보세요!

    
    1) Notion 페이지와 연결된 Github 이슈 생성하기 (TMI: ${this.withBlueBoldChalk(
      "ci"
    )} 는 ${this.withBlueBoldChalk("create issue")} 의 약자입니다)
    
    ${this.withYellowBoldChalk("fika")} ${this.withBlueBoldChalk("ci")} [NOTION_PAGE_URL]
    
    
    
    2) Notion 페이지와 연결된 Github 풀리퀘스트 (PR) 생성하기 (TMI: ${this.withBlueBoldChalk(
      "cpr"
    )} 은 ${this.withBlueBoldChalk("create PR")} 의 약자입니다)
    
    ${this.withYellowBoldChalk("fika")} ${this.withBlueBoldChalk("cpr")} [NOTION_PAGE_URL]
    `);
  }

  showConnecting(connectingUrl: string): void {
    this.rl.write(
      `\n ${this.withCyanBoldChalk(
        "Fika"
      )} opens below 👇url to connect with ${this.withYellowBoldChalk(
        "Notion"
      )}\n\n ${this.underline(this.colorize(white, connectingUrl))}\n`
    );
  }

  showCreateIssueSuccess(issue: Issue): void {
    this._clear();
    const issueNumber = Issue.parseNumberFromUrl(issue.issueUrl!);
    const issueBranch = this.configService.getIssueBranch(issueNumber);
    this.rl.write(`🎉 이슈 생성에 성공하였습니다!  "${this.withCyanBoldChalk(issue.title)}"`);
    this.rl.write("");
    this.rl.write(`🟢 github issue url:  ${this.withYellowBoldChalk(issue.issueUrl)}`);
    this.rl.write(`🟢 notion url:  ${this.withBlueBoldChalk(issue.notionUrl)}`);
    this.rl.write("");
    this.rl.write(`------------------------------------------------`);
    this.rl.write("");
    this.rl.write(`해당 이슈를 처리하기 위한 브랜치를 생성하시려면`);
    this.rl.write(`아래 커맨드를 실행해 주세요.\n\n`);
    this.rl.write(`${this.withWhiteBoldChalk(`git checkout -b ${issueBranch}`)}`);
    this.rl.write("");
    this.rl.write("");
  }

  showCreatePRSuccess(issue: Issue): void {
    const baseBranch = this.configService.getBaseBranch();
    this._clear();
    this.rl.write(
      `🎉 Pull Request (PR) 생성에 성공하였습니다!  "${this.withCyanBoldChalk(issue.title)}"`
    );
    this.rl.write("");
    this.rl.write(`🟢 github PR url:  ${this.withYellowBoldChalk(issue.prUrl)}`);
    this.rl.write(`🟢 notion url:  ${this.withBlueBoldChalk(issue.notionUrl)}`);
    this.rl.write("");
    this.rl.write(`Github 에서 PR 을 병합한 이후에는`);
    this.rl.write(`아래 커맨드를 실행해 주세요.\n\n`);
    this.rl.write(`${this.withWhiteBoldChalk(`git checkout ${baseBranch}`)}`);
    this.rl.write(`${this.withWhiteBoldChalk(`git pull origin ${baseBranch}`)}\n\n`);
  }

  _parseIssueNumberFromUrl(issueUrl: string): string {
    const fragments = issueUrl.split("/");
    return fragments[fragments.length - 1];
  }

  private withYellowBoldChalk = (word: string) => this.bold(this.colorize(yellow, word));
  private withGreenBoldChalk = (word: string) => this.bold(this.colorize(green, word));
  private withRedBoldChalk = (word: string) => this.bold(this.colorize(red, word));
  private withBlueBoldChalk = (word: string) => this.bold(this.colorize(blue, word));
  private withCyanBoldChalk = (word: string) => this.bold(this.colorize(cyan, word));
  private withWhiteBoldChalk = (word: string) => this.bold(this.colorize(white, word));
  private withYellowUnderlineChalk = (word: string) => this.underline(this.colorize(yellow, word));

  private colorize = (color: TerminalColor, text) => {
    return `\x1b[${color.x}m${text}\x1b[${color.y}m`;
  };

  private bold = text => {
    return `\x1b[1m${text}\x1b[m`;
  };

  private underline = text => {
    return `\x1b[4m${text}\x1b[m`;
  };

  private _clear = () => {
    const lines = process.stdout.rows;
    for (let index = 0; index < lines; index++) {
      readline.cursorTo(output, 0, 0);
      readline.clearLine(output, 0);
    }
  };
}
