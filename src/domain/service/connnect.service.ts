import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { IConnectService } from "./i_connect.service";
import open from 'open';
import axios, { AxiosError } from "axios";
import { CreateIssueDto, CreateIssueDtoType } from "src/infrastructure/dto/create_issue.dto";
import { injectable } from "inversify";
import { fikaCallbackUri, fikaNotionClientId, notionAuthorizeUri } from "src/config/constants/uri";
import { Issue } from "../entity/issue.entity";
import { CreateNotionWorkspaceDto, CreateNotionWorkspaceDtoType } from "src/infrastructure/dto/create_notion_workspace.dto";

@injectable()
export class ConnectService implements IConnectService {
  async getIssue(documentUrl: string, botId: string): Promise<Issue> {
    try{
      const response = await axios.post('https://fikaapi.kkiri.app/notion/issue',
        {
          botId: botId,
          documentUrl: documentUrl,
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
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  async updateIssue(updatedIssue: Issue, botId: string): Promise<Issue> {
    try{
      const response = await axios.post('https://fikaapi.kkiri.app/notion/issue',
        {
          ...updatedIssue,
          botId
        },
        {
          headers: {
            "content-type": "application/json",
          }
        },
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
  async requestNotionWorkspace(): Promise<NotionWorkspace> {
    try{
      const response = await axios.get('https://fikaapi.kkiri.app/notion/workspace?id=0aefa0c0-ceed-4158-be40-6dfc3901770e');
      const dto = new CreateNotionWorkspaceDto(response.data as CreateNotionWorkspaceDtoType);
      return dto.toEntity();
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',e.code);
      throw new Error(e.response?.message);
    }
    
  }
}