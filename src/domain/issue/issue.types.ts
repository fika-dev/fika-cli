import { Issue } from "../entity/issue.entity";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { ValidationError } from "../rules/validation-rules/validation-rule.types";
import { DomainError } from "../general/general.types";
type UnvalidatedIssueNumber = number;
export type ValidatedIssueNumber = number;
type FoundIssueRecord = Issue;

export type GetIssueRecordByNumber = {
  description: "Get Issue Record By Number";
  (issueNumber: ValidatedIssueNumber): TE.TaskEither<DomainError, FoundIssueRecord>;
};

export type GetIssueRecordByNumberBuilder = () => GetIssueRecordByNumber;

export type ValidateIssueNumber = {
  descriptoin: "Validator function for issue number returning Either";
  (unvalidatedIssueNumber: UnvalidatedIssueNumber): E.Either<ValidationError, ValidatedIssueNumber>;
};
