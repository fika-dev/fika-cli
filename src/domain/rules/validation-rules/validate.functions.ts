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

export const validateHttpAddress: Validate<string> = (unvalidatedAddress: string) => {
  if (unvalidatedAddress.startsWith("http")) {
    return E.right(unvalidatedAddress);
  } else {
    return E.left({ type: "NotHttpAddress", value: unvalidatedAddress } as ValidationError);
  }
};

export const validateIncludeString = (pattern: string) => (unvalidatedString: string) => {
  const matched = unvalidatedString.includes(pattern);
  if (matched) {
    return E.right(unvalidatedString);
  } else {
    return E.left({ type: "NotIncludingPattern", value: unvalidatedString } as ValidationError);
  }
};

export const validateBranchName: Validate<string> = (unvalidatedBranchName: string) => {
  const branchNamePattern: RegExp = /^[A-Za-z\.\/\#\_\@-]+$/g;
  const matched = branchNamePattern.exec(unvalidatedBranchName);
  if (matched) {
    return E.right(unvalidatedBranchName);
  } else {
    return E.left({ type: "BranchName", value: unvalidatedBranchName } as ValidationError);
  }
};

export const validateHttpsGithubAddress: Validate<string> = (unvalidatedAddress: string) => {
  const httpsGithubAddressPattern: RegExp = /https\:\/\/github\.com\/(.+)\/(.+)\.git/g;
  const matched = httpsGithubAddressPattern.exec(unvalidatedAddress);
  if (matched) {
    return E.right(unvalidatedAddress);
  } else {
    return E.left({ type: "HttpsGithubAddress", value: unvalidatedAddress } as ValidationError);
  }
};

export const validateSshGithubAddress: Validate<string> = (unvalidatedAddress: string) => {
  const sshGithubAddressPattern: RegExp = /git\@github.com\:(.+)\/(.+)\.git/g;
  const matched = sshGithubAddressPattern.exec(unvalidatedAddress);
  if (matched) {
    return E.right(unvalidatedAddress);
  } else {
    return E.left({ type: "SshGithubAddress", value: unvalidatedAddress } as ValidationError);
  }
};

export const validateCheckOut: Validate<Context> = context => E.right(context);
