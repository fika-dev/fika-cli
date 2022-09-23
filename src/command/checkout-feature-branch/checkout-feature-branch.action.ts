import * as E from "fp-ts/Either";
import { flow } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IPromptService } from "src/domain/service/i-prompt.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IGitPlatformService } from "src/domain/service/i_git_platform.service";
import { IMessageService } from "src/domain/service/i_message.service";

import { GetContext } from "@/domain/context/context.types";
import { Unit } from "@/domain/general/general.types";
import { CheckoutToIssue, GitCommandExecuter } from "@/domain/git-command/command.types";
import { GetIssueRecordByNumber, ValidateIssueNumber } from "@/domain/issue/issue.types";
import { ReportError, ReportSuccess } from "@/domain/report/report.types";
import { ValidateContext } from "@/domain/rules/validation-rules/validation-rule.types";
import { RuleCombinator } from "src/domain/rules/rule.types";
import { Context } from "vm";
import { checkoutToIssueBuilder } from "@/domain/git-command/command.functions";

const _checkoutFeatureBranchLegacy = async (issueNumber?: number) => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();

  let featureBranch: string;
  if (issueNumber && !isNaN(issueNumber)) {
    featureBranch = configService.getIssueBranch(issueNumber);
  } else if (issueNumber && isNaN(issueNumber)) {
    messageService.showWarning("Could not understand your request, please provide a valid number");
    return;
  } else {
    featureBranch = await gitPlatformService.getLatestBranchByCommitDate();
  }
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(
      "There is uncommited changes\nDo you wanna continue? (y or n)"
    );
    if (!proceed) return;
  }
  if (featureBranch && featureBranch !== "") {
    await gitPlatformService.checkoutToFeatureBranch(featureBranch);
    messageService.showSuccess(`Checkout to branch: ${featureBranch}`);
  } else {
    messageService.showWarning("Could not find a feature branch that matches your request");
  }
};
export const checkoutFeatureBranchAction = _checkoutFeatureBranchLegacy;

const _functionalCheckoutFeatureBranch = async (issueNumber?: number) => {
  const validateCheckOut = validateCheckOutBuilder(getContext)(setContext);
  const checkoutToIssue = checkoutToIssueBuilder(exec);
  return flow(
    O.fromNullable,
    O.fold(
      () => T.of("Unit"),
      flow(
        validateIssueNumber,
        E.chainFirst(() => validateCheckOut(isCheckOutOkRule)),
        TE.fromEither,
        TE.chain(findIssueRecordByNumber),
        TE.chain(checkoutToIssue),
        TE.fold(
          e => T.of(reportError(e)),
          s => T.of(reportSuccess(s))
        )
      )
    ),
    O.getOrElse
  )(issueNumber);
};

declare const getContext: GetContext;
declare function setContext(context: Context): Unit;
declare const validateCheckOutBuilder: ValidateContext;
declare const exec: GitCommandExecuter;
declare const validateIssueNumber: ValidateIssueNumber;
declare const findIssueRecordByNumber: GetIssueRecordByNumber;
declare const reportError: ReportError;
declare const reportSuccess: ReportSuccess;
declare const isCheckOutOkRule: RuleCombinator;
