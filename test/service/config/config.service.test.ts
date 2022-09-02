import { defaultConfig } from "@/config/constants/default_config";
import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { IConfigService } from "@/domain/service/i_config.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import fs from "fs";
import container from "src/config/ioc_config";
import { OLD_TEST_CONFIG, TEST_NOTION_WORKSPACE_ID, TEST_USER_CONFIG } from "test/test-constants";



beforeAll(()=>{
  jest.spyOn(process.stdout, "write").mockImplementation(()=>true);
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});


test('1. when there is old workspace', async () => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return OLD_TEST_CONFIG;
  });
  let fileContents
  const spy = jest.spyOn(fs, "writeFileSync").mockImplementation((_, data)=>{
    fileContents = data;
  });
  configService.readConfig();
  const workspaceId = configService.getWorkspaceId().asString();
  expect(fileContents).toContain('workspace');
  expect(fileContents).toContain(TEST_NOTION_WORKSPACE_ID);
  expect(fileContents).not.toContain('notionWorkspace');
  expect(workspaceId).toEqual(TEST_NOTION_WORKSPACE_ID);
});

test('2. when it is new workspace', async () => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return JSON.stringify(TEST_USER_CONFIG);
  });
  configService.readConfig();
  const workspaceId = configService.getWorkspaceId().asString();
  expect(workspaceId).toEqual(TEST_NOTION_WORKSPACE_ID);
});

test('3. when there was no config file', async () => {
  jest.spyOn(fs, "existsSync").mockImplementation((_)=>{
    return false;
  });
  jest.spyOn(fs, "mkdirSync").mockImplementation((_)=>{
    return undefined;  
  });
  jest.spyOn(fs, "readFileSync").mockImplementation((_)=>{
    return JSON.stringify(defaultConfig);
  });
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  let errorName;
  let workspaceId;
  configService.readConfig();
  try{
    workspaceId = configService.getWorkspaceId();
  }catch(e){
    const exception = e as BaseException
    errorName = exception.name
  }
  expect(errorName).toEqual("WORKSPACE_NOT_CONNECTED");
  
});