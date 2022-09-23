import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import {
  NotNumberError,
  ValidationError,
  ValidationResolverBuilder,
} from "./validation-rule.types";
export const validateNumber = (value: number): E.Either<NotNumberError, number> => {
  if (isNaN(value)) {
    return E.left({ type: "NotNumberError", value });
  } else {
    return E.right(value);
  }
};

export const resolveValidationError: ValidationResolverBuilder<any> =
  errorHandler => errorOrValue =>
    pipe(
      errorOrValue,
      E.fold(
        e => errorHandler(e),
        value => O.some(value)
      )
    );
