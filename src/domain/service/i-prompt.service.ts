import { Morpher } from "../entity/add_on/morpher.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { VersionTag } from "../value_object/version_tag.vo";

export interface IPromptService {
  askAlreadySignedUp(): Promise<boolean>;
  askEmailAddress(): Promise<string>;
  askPassword(): Promise<string>;
  askOtpToken(email: string): Promise<string>;
  askTagInfo(latestTag: VersionTag | undefined): Promise<VersionTag>;
  askBranchName(message: string, defaultName: string, candidates: string[]): Promise<string>;
  askRemoteUrl(): Promise<string>;
  confirmAction(message: string): Promise<boolean>;
}
