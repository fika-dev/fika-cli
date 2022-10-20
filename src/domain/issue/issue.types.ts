import { Issue } from "../entity/issue.entity";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { DomainError } from "../general/general.types";
type UnvalidatedIssueNumber = number;
export type ValidatedIssueNumber = number;
type FoundIssueRecord = Issue;

export type GetIssueRecordByNumber = {
  description: "Get Issue Record By Number";
  (issueNumber: ValidatedIssueNumber): TE.TaskEither<DomainError, FoundIssueRecord>;
};

export type GetIssueRecordByNumberBuilder = () => GetIssueRecordByNumber;
