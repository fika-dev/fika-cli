import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConnectService } from "src/domain/service/i_connect.service";

beforeAll(()=>{
  jest.spyOn(console, "log").mockImplementation(() => true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});

test('1. test valid email', async () => { 
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const isValidEmail = await connectService.isAvailableEmail('wonmo.jung@kkiri.app');
  expect(isValidEmail).toEqual(false);
});

test('2. test invalid email', async () => { 
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const isValidEmail = await connectService.isAvailableEmail('untested2@test.com');
  expect(isValidEmail).toEqual(true);
});


test('3. test invalid email', async () => { 
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  try{
    const userWithToken = await connectService.signup('untested@test.com', 'testtest', 'WRONG_TOKEN');
  }catch(e){
    expect(e).toBeDefined();
  }
});
