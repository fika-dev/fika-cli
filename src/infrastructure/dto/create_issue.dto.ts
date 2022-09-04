import { BaseDto } from "./base_dto";
import { Issue } from "../../domain/entity/issue.entity";

export interface CreateIssueDtoType {
  gitIssueUrl?: string;
  issueUrl: string;
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
      gitIssueUrl: this.dto.gitIssueUrl,
      issueUrl: this.dto.issueUrl,
      title: this.dto.title,
      body: this.dto.body,
      labels: this.dto.labels,
    };
  }
}
