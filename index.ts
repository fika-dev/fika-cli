import { program } from 'commander';
import { initCommand } from 'src/command/init';
import { pushCommand } from 'src/command/push';




program.addCommand(pushCommand);
program.addCommand(initCommand);
program.parse(process.argv);