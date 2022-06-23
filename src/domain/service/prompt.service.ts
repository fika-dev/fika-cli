import { injectable } from "inversify";
import { IPromptService } from "./i-prompt.service";
import promptly from "promptly";
import { VersionTag } from "../value_object/version_tag.vo";

@injectable()
export class PromptService implements IPromptService {
  async askTagInfo(latestTag: VersionTag): Promise<VersionTag> {
    const answer = await promptly.prompt(
      `What tag do you wanna name this release branch? For information the latest tag is ${latestTag}`
    );
    return VersionTag.parseVersion(answer);
  }
  async askAlreadySignedUp(): Promise<boolean> {
    const answer = await promptly.confirm(
      "이미 Fika 계정이 있으신가요? (y or n)"
    );
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
