import { Morpher } from "../entity/morpher.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IPromptService {
  askAlreadySignedUp(): Promise<boolean>
  askEmailAddress(): Promise<string>
  askPassword(): Promise<string>
  askOtpToken(): Promise<string>
}