import { pushCommand } from './command/push';
import { program } from 'commander';


program.addCommand(pushCommand);
program.parse(process.argv);