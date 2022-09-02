import { BaseDto } from "./base_dto";
import { Issue } from "../../domain/entity/issue.entity";

export interface CreateIssueDtoType {
  issueUrl?: string;
  notionUrl: string;
  title: string;
  body?: string;
  labels: string[];
}

export class CreateIssueDto extends BaseDto<Issue, CreateIssueDtoType> {
  constructor(dto: CreateIssueDtoType) {
    super(dto);
  }
  toEntity(): Issue {
    return {
      gitIssueUrl: this.dto.issueUrl,
      notionUrl: this.dto.notionUrl,
      title: this.dto.title,
      body: this.dto.body,
      labels: this.dto.labels,
    };
  }
}
