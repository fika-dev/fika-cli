// import path from 'path';
import { Command } from 'commander';
import open from 'open';
import { asyncErrorHandler } from '../error/error_handlers';
import { connectAction } from './connect.action';

export const connectCommand = new Command()
  .command('connect [remoteName]')
  .description('connect')
  // .option('-p, --port <number>', 'port to run server on', '4005')
  .action( async (remoteName = 'org', options: { port: string }) => {
    asyncErrorHandler(connectAction());
  });
