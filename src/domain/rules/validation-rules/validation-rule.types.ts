import { Context, GetContext, SetContext } from "@/domain/context/context.types";
import { DomainError, Unit } from "@/domain/general/general.types";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { RuleCombinator } from "../rule.types";

export type ValidationErrorHandler<T> = (error: DomainError) => O.Option<T>;
export type ValidationResolverBuilder<T> = (
  errorHandler: ValidationErrorHandler<T>
) => ValidationResolver<T>;
export type ValidationResolver<T> = (errorOrValue: E.Either<DomainError, T>) => O.Option<T>;
export type Validate<T> = (value?: T) => E.Either<DomainError, T>;
export type ValidateContext = (
  getContext: GetContext
) => (setContext: SetContext) => (rule: RuleCombinator) => E.Either<DomainError, Unit>;
