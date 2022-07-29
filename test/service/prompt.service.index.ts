import { developBranchCandidates } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";

const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);

function testWrite() { 
  promptService.askBranchName(
    "Develop Branch Name",
    "develop",
    []
  )
}
testWrite();
