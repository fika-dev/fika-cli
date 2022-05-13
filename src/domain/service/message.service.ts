import { injectable } from "inversify";
import { Issue } from "../entity/issue.entity";
import { IMessageService } from "./i_message.service";

@injectable()
export class MessageService implements IMessageService{
  showSuccess(message: string): void {
    console.log(`${message}`);
  }

  showCreateIssueSuccess(issue: Issue): void {
    console.log(`이슈 생성에 성공하였습니다!  "${issue.title}"`);
    console.log('');
    console.log(`github issue url:  ${issue.issueUrl}`);
    console.log(`notion url:  ${issue.notionUrl}`);
    console.log('');
    console.log(`------------------------------------------------`);
    console.log('');
    console.log(`해당 이슈를 처리하기 위한 브랜치를 생성하시려면`);
    console.log(`현재 change 를 commit 하거나 stash 한 후 아래 커맨드를 실행해 주세요.\n\n`);
    console.log(`git checkout -b feature/iss-${this._parseIssueNumber(issue.issueUrl!)}`);
    console.log('');
    console.log('');
  }
  showError(message: string): void {
    throw new Error("Method not implemented.");
  }

  _parseIssueNumber(issueUrl: string): string{
    const fragments = issueUrl.split('/');
    return fragments[fragments.length-1]
  }
}