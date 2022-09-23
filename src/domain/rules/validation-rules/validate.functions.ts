import { Context } from "@/domain/context/context.types";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import { ValidationError, Validate } from "./validation-rule.types";
import { validateNumber } from "./validation-rules.functions";

export const validateIssueNumber: Validate<number> = (
  issueNumber: number
): E.Either<ValidationError, number> => {
  return pipe(
    issueNumber,
    O.fromNullable,
    O.foldW(
      () => E.left({ type: "NotNumberError", value: null } as ValidationError),
      number => validateNumber(number)
    )
  );
};

export const validateCheckOut: Validate<Context> = context => E.right(context);
