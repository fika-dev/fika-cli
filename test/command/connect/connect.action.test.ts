
import { connectCommand } from "@/command/connect";
import * as action from "@/command/connect/connect.action";
import { IConnectService } from "@/domain/service/i_connect.service";
import { FikaToken } from "@/domain/value_object/fika-token.vo";
import axios from "axios";
import { program } from "commander";
import { WorkspaceCreator } from "plug_in/workspace_platform/workspace-creator";
import SERVICE_IDENTIFIER, { PARAMETER_IDENTIFIER } from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { TEST_USER_CONFIG, TEST_USER_HASH } from "test/test-constants";
import { checkAndCloneRepo } from "test/test-utils";


beforeAll(()=>{
  checkAndCloneRepo()
});

beforeEach(()=>{
  container.snapshot();
});

afterEach(()=>{
  container.restore();
});

test('1. check notion authentication uri status', async () => { 
  const domain = container.get<string>(PARAMETER_IDENTIFIER.Domain);
  const workspace = WorkspaceCreator.fromType('notion');
  const uri = workspace.getAuthenticationUri(domain, TEST_USER_HASH);
  const response = await axios.get(uri);
  expect(response.status).toEqual(200);
});

test('2. check jira authentication uri status', async () => { 
  const domain = container.get<string>(PARAMETER_IDENTIFIER.Domain);
  const workspace = WorkspaceCreator.fromType('jira');
  const uri = workspace.getAuthenticationUri(domain, TEST_USER_HASH);
  const response = await axios.get(uri);
  expect(response.status).toEqual(200);
});

test('3. get hash', async () => { 
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  connectService.useToken((TEST_USER_CONFIG.fikaToken as FikaToken).accessToken);
  const hash = await connectService.getHash();
  expect(hash).toBeDefined();
});
