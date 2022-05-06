import { injectable } from "inversify";
import { IMessageService } from "./i_message.service";

@injectable()
export class MessageService implements IMessageService{
  showSuccess(message: string): void {
    console.log('🧪', ' in MessageService: ', 'success: ');
  }
  showError(message: string): void {
    throw new Error("Method not implemented.");
  }
}