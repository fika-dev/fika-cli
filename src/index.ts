#!/usr/bin/env node
import { connectCommand } from '@/command/connect';
import { pushCommand } from '@/command/push';
import { createCommand, createIssueShortCommand, createPRShortCommand } from '@/command/create';
import { program } from 'commander';
import { setCommand } from './command/set';
import container from './config/ioc_config';
import { IErrorHandlingService } from './domain/service/i_error_handling.service';
import SERVICE_IDENTIFIER from './config/constants/identifiers';

try{
  program.name('fika')
  .description('CLI for advanced your workflow')
  .version('0.1.3');
  program.addCommand(pushCommand);
  program.addCommand(createCommand);
  program.addCommand(createIssueShortCommand);
  program.addCommand(createPRShortCommand);
  program.addCommand(connectCommand);
  program.addCommand(setCommand);
  program.parse(process.argv);
}catch(e){
  const errorHandlingService = container.get<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService);
  errorHandlingService.handle(e);
}
