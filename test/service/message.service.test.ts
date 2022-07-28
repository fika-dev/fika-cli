import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IMessageService } from "@/domain/service/i_message.service";

const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);

function testWrite() { 
  messageService.start();
  messageService.showConnecting("https://fikadev.com");
  setTimeout(() => {
    messageService.showConnectSuccess();
    messageService.close();
  }, 1000);
}
// testWrite();

it('', ()=>{});