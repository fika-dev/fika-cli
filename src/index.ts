#!/usr/bin/env node
import { connectCommand } from '@/command/connect';
import { pushCommand } from '@/command/push';
import { createCommand, createIssueShortCommand, createPRShortCommand } from '@/command/create';
import { program } from 'commander';
import { setCommand } from './command/set';
import container from './config/ioc_config';
import { IErrorHandlingService } from './domain/service/i_error_handling.service';
import SERVICE_IDENTIFIER from './config/constants/identifiers';
import BaseException from './domain/value_object/exceptions/base_exception';
import { UnknownError } from './domain/value_object/exceptions/unknown_error';
import {version} from '../package.json';

try{
  
  program.name('fika')
  .description('CLI for advanced your workflow')
  .version(version);
  program.addCommand(createCommand);
  program.addCommand(createIssueShortCommand);
  program.addCommand(createPRShortCommand);
  program.addCommand(connectCommand);
  program.addCommand(setCommand);
  program.parse(process.argv);
}catch(e){
  const errorHandlingService = container.get<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService);
  if (!(e instanceof BaseException)){
    const unknownError = new UnknownError("UNKNOWN_ERROR", e.message);
    errorHandlingService.handle(unknownError);  
  }
  errorHandlingService.handle(e);
}
