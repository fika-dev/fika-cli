#!/usr/bin/env node
import { connectCommand } from '@/command/connect';
import { pushCommand } from '@/command/push';
import { createCommand } from '@/command/create';
import { program } from 'commander';
import { setCommand } from './command/set';

program.name('fika')
  .description('CLI for advanced your workflow')
  .version('0.1.3');

program.addCommand(pushCommand);
program.addCommand(createCommand);
program.addCommand(connectCommand);
program.addCommand(setCommand);
program.parse(process.argv);