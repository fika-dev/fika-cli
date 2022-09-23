import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { ValidationResolverBuilder } from "./validation-rule.types";

export const resolveValidationError: ValidationResolverBuilder<any> =
  errorHandler => errorOrValue =>
    pipe(
      errorOrValue,
      E.fold(
        e => errorHandler(e),
        value => O.some(value)
      )
    );
