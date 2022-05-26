import { injectable } from "inversify";
import { IPromptService } from "./i-prompt.service";

@injectable()
export class PromptService implements IPromptService{
  askAlreadySignedUp(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  askEmailAddress(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  askPassword(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  askOtpToken(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}