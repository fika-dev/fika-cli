import { injectable } from "inversify";
import { IPromptService } from "./i-prompt.service";
import promptly from 'promptly';

@injectable()
export class PromptService implements IPromptService{
  async askAlreadySignedUp(): Promise<boolean> {
    const answer = await promptly.confirm('이미 Fika 계정이 있으신가요? (y or n)');
    return answer;
  }
  async askEmailAddress(): Promise<string> {
    const emailAddress = await promptly.prompt('이메일 주소를 입력해주세요: ');
    return emailAddress;
  }
  async askPassword(): Promise<string> {
    const password = await promptly.password('비밀번호를 입력해주세요: ');
    return password;
  }
  async askOtpToken(): Promise<string> {
    const otpToken = await promptly.password('OTP 를 입력해주세요: ');
    return otpToken;
  }
}