import { injectable } from "inversify";
import promptly from "promptly";
import { VersionTag } from "../value_object/version_tag.vo";
import { IPromptService } from "./i-prompt.service";
const prompts = require("prompts");
import { Workspace } from "../entity/workspace.entity";
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
export class PromptService implements IPromptService {
  private acceptsAllPromptsAsYes: boolean = false;

  public setAcceptsAllPromptsAsYes() {
    this.acceptsAllPromptsAsYes = true;
  }

  // async confirmAction(message: string): Promise<boolean> {
  //   if (this.acceptsAllPromptsAsYes) {
  //     return true;
  //   }
  //   const answer = await promptly.confirm(`${this.bold(this.colorize(green, "?"))} ${message}: `);
  //   return answer;
  // }

  async confirmAction(message: string): Promise<boolean> {
    if (this.acceptsAllPromptsAsYes) {
      return true;
    }
    const resp = await prompts([
      {
        type: "confirm",
        name: "confirmAction",
        message: message,
        initial: true,
      },
    ]);
    return resp.confirmAction;
  }

  // async askBranchName(message: string, defaultName: string, candidates: string[]): Promise<string> {
  //   const validator = function (value) {
  //     if (value.length < 1) {
  //       throw new Error("Min length of 1");
  //     }
  //     return value;
  //   };
  //   const candidatesText = candidates.join(", ");
  //   let question: string;
  //   if (candidatesText.length > 0) {
  //     question = `${this.bold(this.colorize(green, "?"))} ${this.bold(
  //       this.colorize(white, message)
  //     )} (Default: ${defaultName}): `;
  //   } else {
  //     question = `${this.bold(this.colorize(green, "?"))} ${this.bold(
  //       this.colorize(white, message)
  //     )} (Default: ${defaultName}): `;
  //   }
  //   const answer = await promptly.prompt(question, {
  //     default: defaultName,
  //     validator,
  //     retry: true,
  //     trim: true,
  //   });
  //   return answer;
  // }

  async askBranchName(message: string, defaultName: string, candidates: string[]): Promise<string> {
    const resp = await prompts([
      {
        type: "text",
        name: "branchNames",
        message: `${message} (Default: ${defaultName}): `,
        initial: defaultName,
        validate: resp => (resp.length < 0 ? "Min length is 1" : true),
      },
    ]);
    console.log(resp);
    return resp.branchNames.replace(" ", "").trim();
  }

  // async askTagInfo(latestTag: VersionTag): Promise<VersionTag> {
  //   let question: string;

  //   if (latestTag) {
  //     question = `release 브랜치에 어떤 tag 를 붙이시겠습니까?\n가장 최근 tag 는 ${latestTag.verionString} 입니다.\ntag: `;
  //   } else {
  //     question = `release 브랜치에 어떤 tag 를 붙이시겠습니까?\n아직 정의된 tag 가 없습니다.`;
  //   }
  //   const answer = await promptly.prompt(question);
  //   return VersionTag.parseVersion(answer);
  // }
  async askTagInfo(latestTag: VersionTag): Promise<VersionTag> {
    const resp = await prompts([
      {
        type: "text",
        name: "tagInfo",
        message: () =>
          latestTag
            ? `release 브랜치에 어떤 tag 를 붙이시겠습니까?\n가장 최근 tag 는 ${latestTag.verionString} 입니다.\ntag: `
            : `release 브랜치에 어떤 tag 를 붙이시겠습니까?\n아직 정의된 tag 가 없습니다.`,
      },
    ]);
    return VersionTag.parseVersion(resp.tagInfo);
  }

  // async askAlreadySignedUp(): Promise<boolean> {
  //   const answer = await promptly.confirm(
  //     `${this.bold(this.colorize(green, "?"))} Do you have ${this.bold(
  //       this.colorize(cyan, "Fika account")
  //     )}? (y or n)`
  //   );
  //   return answer;
  // }
  async askAlreadySignedUp(): Promise<boolean> {
    const resp = await prompts([
      {
        type: "toggle",
        name: "alreadySignedUp",
        message: "Do you have a Fika account?",
        initial: true,
        active: "yes",
        inactive: "no",
      },
    ]);
    return resp.alreadySignedUp;
  }
  // async askEmailAddress(): Promise<string> {
  //   const emailAddress = await promptly.prompt(
  //     `${this.bold(this.colorize(green, "?"))} ${this.bold(
  //       this.colorize(white, "Email Address")
  //     )} : `
  //   );
  //   return emailAddress;
  // }
  async askEmailAddress(): Promise<string> {
    const resp = await prompts([
      {
        type: "text",
        name: "emailAddress",
        message: "Enter your email address : ",
      },
    ]);
    return resp.emailAddress;
  }
  // async askPassword(): Promise<string> {
  //   const password = await promptly.password(
  //     `${this.bold(this.colorize(green, "?"))} ${this.bold(this.colorize(white, "Password"))} : `
  //   );
  //   return password;
  // }
  async askPassword(): Promise<string> {
    const resp = await prompts([
      {
        type: "password",
        name: "password",
        message: "Password",
      },
    ]);
    return resp.password;
  }

  // async askOtpToken(email: string): Promise<string> {
  //   const otpToken = await promptly.password(
  //     `OTP Token is sent to your email (${email})\n${this.bold(
  //       this.colorize(green, "?")
  //     )} ${this.bold(this.colorize(white, "OTP Token"))} : `
  //   );
  //   return otpToken;
  // }
  async askOtpToken(email: string): Promise<string> {
    const resp = await prompts([
      {
        type: "text",
        name: "otpToken",
        message: `Enter the OTP Token that was sent to your email ${email} : `,
      },
    ]);
    return resp.otpToken;
  }
  // async askRemoteUrl(): Promise<string> {
  //   const remoteUrl = await promptly.prompt(
  //     `${this.bold(this.colorize(green, "?"))} ${this.bold(
  //       this.colorize(white, "remote origin Url")
  //     )} : `
  //   );
  //   return remoteUrl;
  // }
  async askRemoteUrl(): Promise<string> {
    const resp = await prompts([
      {
        type: "text",
        name: "remoteOriginUrl",
        message: "Enter the remote origin Url : ",
      },
    ]);
    return resp.remoteOriginUrl;
  }
  // private colorize = (color: TerminalColor, text) => {
  //   return `\x1b[${color.x}m${text}\x1b[${color.y}m`;
  // };
  // private bold = text => {
  //   return `\x1b[1m${text}\x1b[m`;
  // };
  async askChooseWorkspace(workspaceList: Workspace[]): Promise<string> {
    const resp = await prompts([
      {
        type: "select",
        name: "chooseWorkspace",
        message: "Select a project :",
        choices: workspaceList.map(workspace => {
          return {
            title: workspace.workspaceName + " from " + workspace.workspaceType,
            value: workspace.id,
          };
        }),
      },
    ]);
    return resp.chooseWorkspace;
  }
}
