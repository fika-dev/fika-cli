import { program } from 'commander';
import { pushCommand } from './command/push';
import { initCommand } from './command/init';




program.addCommand(pushCommand);
program.addCommand(initCommand);
program.parse(process.argv);