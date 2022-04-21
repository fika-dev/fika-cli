import { IMessageService } from "./i_message.service";

export class MessageService implements IMessageService{
  showSuccess(message: string): void {
    throw new Error("Method not implemented.");
  }
  showError(message: string): void {
    throw new Error("Method not implemented.");
  }
}