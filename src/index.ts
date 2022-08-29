#!/usr/bin/env node
import { connectCommand } from "@/command/connect";
import { createCommand, createIssueShortCommand, createPRShortCommand } from "@/command/create";
import { program } from "commander";
import dotenv from "dotenv";
import { version } from "../package.json";
import { checkoutDevelopCommand } from "./command/checkout-develop";
import { checkoutFeatureBranchCommand } from "./command/checkout-feature-branch";
import { finishCommand } from "./command/finish";
import { infoCommand } from "./command/info";
import { initCommand } from "./command/init";
import { releaseCommand } from "./command/release";
import { setCommand } from "./command/set";
import { startCommand } from "./command/start";
import SERVICE_IDENTIFIER from "./config/constants/identifiers";
import container from "./config/ioc_config";
import { IErrorHandlingService } from "./domain/service/i_error_handling.service";
import BaseException from "./domain/value_object/exceptions/base_exception";
import { UnknownError } from "./domain/value_object/exceptions/unknown_error";

try {
  dotenv.config();
  program.name("fika").description("CLI for advanced your workflow").version(version);
  program.addCommand(startCommand);
  program.addCommand(finishCommand);
  program.addCommand(createCommand);
  program.addCommand(createIssueShortCommand);
  program.addCommand(createPRShortCommand);
  program.addCommand(connectCommand);
  program.addCommand(setCommand);
  program.addCommand(releaseCommand);
  program.addCommand(initCommand);
  program.addCommand(infoCommand);
  program.addCommand(checkoutFeatureBranchCommand);
  program.addCommand(checkoutDevelopCommand);
  program.parse(process.argv);
} catch (e) {
  const errorHandlingService = container.get<IErrorHandlingService>(
    SERVICE_IDENTIFIER.ErrorHandlingService
  );
  if (!(e instanceof BaseException)) {
    const unknownError = new UnknownError("UNKNOWN_ERROR", e.message);
    errorHandlingService.handle(unknownError);
  }
  errorHandlingService.handle(e);
}
