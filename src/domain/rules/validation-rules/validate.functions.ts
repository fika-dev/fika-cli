import { ContextValue } from "@/domain/context/context.types";
import { DomainError } from "@/domain/general/general.types";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Validate } from "./validation-rule.types";

export const validateNumber: Validate<number> = (value: number) => {
  if (isNaN(value)) {
    return E.left({ type: "ValidationError", subType: "NotNumberError", value });
  } else {
    return E.right(value);
  }
};

export const validateIssueNumber: Validate<number> = (
  issueNumber: number
): E.Either<DomainError, number> => {
  return pipe(
    issueNumber,
    validateNumber,
    E.mapLeft(e => {
      return {
        type: "ValidationError",
        subType: "NotIssueNumberError",
        value: issueNumber,
      } as DomainError;
    })
  );
};

// export const validateHttpAddress: Validate<string> = (unvalidatedAddress: string) => {
//   if (unvalidatedAddress.startsWith("http")) {
//     return E.right(unvalidatedAddress);
//   } else {
//     return E.left({
//       type: "ValidationError",
//       subType: "NotHttpAddress",
//       value: unvalidatedAddress,
//     } as DomainError);
//   }
// };

export const validateIncludeString =
  (pattern: string) =>
  (unvalidatedString: string): E.Either<DomainError, ContextValue> => {
    const matched = unvalidatedString.includes(pattern);
    if (matched) {
      return E.right(unvalidatedString);
    } else {
      return E.left({
        type: "ValidationError",
        subType: "NotIncludingPattern",
        value: unvalidatedString,
      } as DomainError);
    }
  };

export const validateBranchName: Validate<string> = (unvalidatedBranchName: string) => {
  const branchNamePattern: RegExp = /^[A-Za-z0-9\.\/\#\_\@-]+$/g;
  const matched = branchNamePattern.exec(unvalidatedBranchName);
  if (matched) {
    return E.right(unvalidatedBranchName);
  } else {
    return E.left({
      type: "ValidationError",
      subType: "NotBranchName",
      value: unvalidatedBranchName,
    } as DomainError);
  }
};

export const validateHttpsGithubAddress: Validate<string> = (unvalidatedAddress: string) => {
  const httpsGithubAddressPattern: RegExp = /https\:\/\/github\.com\/(.+)\/(.+)\.git/g;
  const matched = httpsGithubAddressPattern.exec(unvalidatedAddress);
  if (matched) {
    return E.right(unvalidatedAddress);
  } else {
    return E.left({
      type: "ValidationError",
      subType: "NotHttpsGithubAddress",
      value: unvalidatedAddress,
    } as DomainError);
  }
};

export const validateSshGithubAddress: Validate<string> = (unvalidatedAddress: string) => {
  const sshGithubAddressPattern: RegExp = /git\@github.com\:(.+)\/(.+)\.git/g;
  const matched = sshGithubAddressPattern.exec(unvalidatedAddress);
  if (matched) {
    return E.right(unvalidatedAddress);
  } else {
    return E.left({
      type: "ValidationError",
      ubType: "NotSshGithubAddress",
      value: unvalidatedAddress,
    } as DomainError);
  }
};
