#!/usr/bin/env node
import { program } from 'commander';
import { initCommand } from '@/command/init';
import { pushCommand } from '@/command/push';
import { connectCommand } from '@/command/connect';

program.name('fika')
  .description('CLI for advanced your workflow')
  .version('0.1.0');

program.addCommand(pushCommand);
program.addCommand(initCommand);
program.addCommand(connectCommand);
program.parse(process.argv);