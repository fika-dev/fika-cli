import { injectable } from "inversify";
import { IPromptService } from "./i-prompt.service";
import promptly from "promptly";
import { VersionTag } from "../value_object/version_tag.vo";

@injectable()
export class PromptService implements IPromptService {
  async askBranchName(message: string, defaultName: string, candidates: string[]): Promise<string> {
    const validator = function (value) {
      if (value.length < 1) {
        throw new Error("Min length of 1");
      }
      return value;
    };

    const candidatesText = candidates.join(", ");
    const question = `${message} (${candidatesText} are already in your branch) : `;
    const answer = await promptly.prompt(question, {
      default: defaultName,
      validator,
      retry: true,
    });
    return answer;
  }
  async askTagInfo(latestTag: VersionTag): Promise<VersionTag> {
    let question: string;

    if (latestTag) {
      question = `release 브랜치에 어떤 tag 를 붙이시겠습니까?\n가장 최근 tag 는 ${latestTag.verionString} 입니다.\ntag: `;
    } else {
      question = `release 브랜치에 어떤 tag 를 붙이시겠습니까?\n아직 정의된 tag 가 없습니다.`;
    }
    const answer = await promptly.prompt(question);
    return VersionTag.parseVersion(answer);
  }
  async askAlreadySignedUp(): Promise<boolean> {
    const answer = await promptly.confirm("이미 Fika 계정이 있으신가요? (y or n)");
    return answer;
  }
  async askEmailAddress(): Promise<string> {
    const emailAddress = await promptly.prompt("이메일 주소를 입력해주세요: ");
    return emailAddress;
  }
  async askPassword(): Promise<string> {
    const password = await promptly.password("비밀번호를 입력해주세요: ");
    return password;
  }
  async askOtpToken(email: string): Promise<string> {
    const otpToken = await promptly.password(
      `${email} 로 OTP 를 전송하였습니다.\n이메일에서 복사한 OTP 를 입력해주세요: `
    );
    return otpToken;
  }
}
