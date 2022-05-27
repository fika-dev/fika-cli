import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { IConnectService, UserWithToken } from "./i_connect.service";
import open from 'open';
import axios, { AxiosError } from "axios";
import { CreateIssueDto, CreateIssueDtoType } from "src/infrastructure/dto/create_issue.dto";
import { injectable } from "inversify";
import { fikaCallbackUri, fikaNotionClientId, notionAuthorizeUri } from "src/config/constants/uri";
import { Issue } from "../entity/issue.entity";
import { CreateNotionWorkspaceDto, CreateNotionWorkspaceDtoType } from "src/infrastructure/dto/create_notion_workspace.dto";
import { Uuid } from "../value_object/uuid.vo";
import { NotionUrl } from "../value_object/notion_url.vo";
import { WrongPropertyTitleName } from "../value_object/exceptions/wrong_property_title_name";

interface errorDataType {
  message: string,
  statusCode: number,
}
@injectable()
export class ConnectService implements IConnectService {
  private token: string | undefined;

  useToken(token: string): void {
    this.token = token;
  }

  async isAvailableEmail(email: string): Promise<boolean> {
    try{
      const response = await axios.post('https://api.fikadev.com/auth/is-valid-email',
        { email },
        {headers: {"content-type": "application/json",}},
      );
      return true;
    }catch(e){
      const axiosError = e as AxiosError;
      if (axiosError.code === '409'){
        return false;
      }
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async requestOtpEmail(email: string, password: string): Promise<void> {
    try{
      const response = await axios.post('https://api.fikadev.com/auth/send-otp-email',
        { email, password },
        {headers: {"content-type": "application/json",}},
      );
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async signup(email: string, password: string, otpToken: string): Promise<UserWithToken> {
    try{
      const response = await axios.post('https://api.fikadev.com/auth/cli/signup',
        { email, password, otpToken },
        {headers: {"content-type": "application/json",}},
      );
      return {accessToken: response.data.token.access_token}
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async signin(email: string, password: string): Promise<UserWithToken> {
    try{
      const response = await axios.post('https://api.fikadev.com/auth/cli/signin',
        { email, password },
        {headers: {"content-type": "application/json",}},
      );
      return {accessToken: response.data.token.access_token}
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }

  async getIssue(documentUrl: NotionUrl, botId: Uuid): Promise<Issue> {
    try{
      const response = await axios.post('https://api.fikadev.com/notion/issue',
        {
          botId: botId.asString(),
          documentUrl: documentUrl.asString(),
        },
        {
          headers: {
            "content-type": "application/json",
          }
        },
      );
      
      const dto = new CreateIssueDto(response.data as CreateIssueDtoType);
      return dto.toEntity();
    }catch(e){
      const axiosError = e as AxiosError;
      const errorData =  axiosError.response.data as errorDataType;
      if (errorData.message === 'WRONG_PROPERTY_TITLE_NAME'){
        throw new WrongPropertyTitleName('WRONG_PROPERTY_TITLE_NAME');
      }
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);;
      throw new Error(axiosError.message);
    }
  }
  async updateIssue(updatedIssue: Issue, botId: Uuid): Promise<Issue> {
    const updatedIssueWithBotId = {
      ...updatedIssue,
      botId: botId.asString(),
    }
    try{
      const response = await axios.post('https://api.fikadev.com/notion/issue/update',
        updatedIssueWithBotId,
        {headers: {"content-type": "application/json",}},
      );
      return updatedIssue;
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  create(devObj: DevObject): Promise<string> {
    throw new Error("Method not implemented.");
  }
  update(devObj: DevObject): Promise<string> {
    throw new Error("Method not implemented.");
  }
  remove(devObj: DevObject): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getNotionAuthenticationUri(): string {
    const redirectUri = encodeURIComponent(fikaCallbackUri);
    const params= `client_id=${fikaNotionClientId}&redirect_uri=${redirectUri}&response_type=code&owner=user&state=init`;
    const targetUri = `${notionAuthorizeUri}?${params}`;
    return targetUri;
  }
  async requestNotionWorkspace(botId: Uuid): Promise<NotionWorkspace> {
    try{
      const response = await axios.get(`https://api.fikadev.com/notion/workspace?id=${botId.asString()}`);
      const dto = new CreateNotionWorkspaceDto(response.data as CreateNotionWorkspaceDtoType);
      return dto.toEntity();
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',e.code);
      throw new Error(e.response?.message);
    }
    
  }
}