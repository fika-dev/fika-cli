import { program } from 'commander';
import { initCommand } from '@/command/init';
import { pushCommand } from '@/command/push';
import { connectCommand } from '@/command/connect';

program.addCommand(pushCommand);
program.addCommand(initCommand);
program.addCommand(connectCommand);
program.parse(process.argv);