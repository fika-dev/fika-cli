import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IMessageService } from "@/domain/service/i_message.service";

const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);

async function testWrite() { 
  messageService.showWaiting("Creating issue in Github");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await messageService.endWaiting();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  messageService.showWarning('Something went wrong');
  messageService.showError({
    code: "CODE",
    message: "There is an error"
  });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await messageService.showSuccess("Issue created", undefined,"https://fikdadev.com");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  messageService.showWaiting("Creating issue in Github2");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  process.stdout.write(`Enter passphrase for key '/Users/wonmojung/.ssh/id_rsa':`)
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await messageService.endWaiting();
}
testWrite();
