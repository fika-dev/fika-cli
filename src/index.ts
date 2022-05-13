#!/usr/bin/env node
import { connectCommand } from '@/command/connect';
import { pushCommand } from '@/command/push';
import { createCommand } from '@/command/create';
import { program } from 'commander';

program.name('fika')
  .description('CLI for advanced your workflow')
  .version('0.1.3');

program.addCommand(pushCommand);
program.addCommand(createCommand);
program.addCommand(connectCommand);
program.parse(process.argv);