import { setAction } from "@/command/set/set.action";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { IMessageService } from "@/domain/service/i_message.service";
import container from "src/config/ioc_config";
import { TEST_NOTION_WORKSPACE_ID } from "test/test-constants";

beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
  jest.spyOn(console, "log").mockImplementation(()=>true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});


test('1. set with correct bot id', async () => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const spy = jest.spyOn(messageService, "showSuccess").mockImplementation();
  await setAction(`notion:${TEST_NOTION_WORKSPACE_ID}`);
  expect(spy).toBeCalled();
});