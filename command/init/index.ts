import { Command } from "commander";

export const initCommand = new Command()
  .command('init')
  .description('init fika in a codebase repo')
  .option('--connect', 'connect to notion after init', false)
  .action( async (options: {connect: boolean}) => {
    console.log('🧪', ' in init/index: ', 'connect: ', options.connect);
    if (options.connect){
      console.log('🧪', ' in init/index: ', 'called with connect option');
    }
  });