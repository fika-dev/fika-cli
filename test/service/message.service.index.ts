import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IMessageService } from "@/domain/service/i_message.service";

const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);

function testWrite() { 
  messageService.showWaiting("Creating issue in Github");
  setTimeout(() => {
    messageService.endWaiting();
  }, 3000);
  setTimeout(() => {
    messageService.showWarning('Something went wrong');
  }, 3010);
  setTimeout(() => {
    messageService.showError({
      code: "CODE",
      message: "There is an error"
    });
  }, 5010);
  setTimeout(() => {
    messageService.showSuccess("Issue created", undefined,"https://fikdadev.com");
  }, 6010);
  setTimeout(() => {
    messageService.showWaiting("Creating issue in Github2");
  }, 7010);
  setTimeout(() => {
    process.stdout.write(`Enter passphrase for key '/Users/wonmojung/.ssh/id_rsa':`)
  }, 9010);
  setTimeout(() => {
    messageService.endWaiting();
  }, 12010);
}
testWrite();
