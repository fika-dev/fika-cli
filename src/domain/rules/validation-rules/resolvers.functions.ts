import * as O from "fp-ts/Option";
import { ValidationErrorHandler, ValidationResolver } from "./validation-rule.types";
import { resolveValidationError } from "./validation-rules.functions";

const issueNumberErrorHander: ValidationErrorHandler<number> = validationError => {
  console.log("Action: Show: Could not understand your request, please provide a valid number");
  return O.none;
};
export const resolvePossibleIssueNumberError: ValidationResolver<number> =
  resolveValidationError(issueNumberErrorHander);
