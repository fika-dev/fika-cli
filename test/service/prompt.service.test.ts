import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import promptly from "promptly";
const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);

beforeAll(async () => {
  jest.restoreAllMocks();
});

beforeEach(async()=>{
  
});

afterEach(async ()=>{
  

})

afterAll(() => {
  
});

describe("1. test confirmAction", () => {
    test("1.1. test confirm action without flag", async () => {
        // const spy = jest.spyOn(promptly, "confirm").mockImplementation(()=>Promise.resolve(false));
        // const answer = await promptService.confirmAction("any message");
        // expect(answer).toBe(false);
        // expect(spy).toHaveBeenCalledTimes(1);
    });
    
    test("1.2. test confirm action with flag", async () => {
        // promptService.setAcceptsAllPromptsAsYes();
        // const spy = jest.spyOn(promptly, "confirm").mockImplementation(()=>Promise.resolve(false));
        // const answer = await promptService.confirmAction("any message");
        // expect(answer).toBe(true);
        // expect(spy).toHaveBeenCalledTimes(0);
  });
});
