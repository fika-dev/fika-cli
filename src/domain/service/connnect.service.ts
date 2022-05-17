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
import { Uuid } from "../value_object/uuid.vo";
import { NotionUrl } from "../value_object/notion_url.vo";

@injectable()
export class ConnectService implements IConnectService {
  async getIssue(documentUrl: NotionUrl, botId: string): Promise<Issue> {
    try{
      const response = await axios.post('https://fikaapi.kkiri.app/notion/issue',
        {
          botId: botId,
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
      console.log('🧪', ' in ConnnectService: ', 'error code: ',axiosError.code);
      throw new Error(axiosError.message);
    }
  }
  async updateIssue(updatedIssue: Issue, botId: string): Promise<Issue> {
    const updatedIssueWithBotId = {
      ...updatedIssue,
      botId
    }
    try{
      const response = await axios.post('https://fikaapi.kkiri.app/notion/issue/update',
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
      const response = await axios.get(`https://fikaapi.kkiri.app/notion/workspace?id=${botId.asString()}`);
      const dto = new CreateNotionWorkspaceDto(response.data as CreateNotionWorkspaceDtoType);
      return dto.toEntity();
    }catch(e){
      const axiosError = e as AxiosError;
      console.log('🧪', ' in ConnnectService: ', 'error code: ',e.code);
      throw new Error(e.response?.message);
    }
    
  }
}