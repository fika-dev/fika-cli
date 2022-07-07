import { Command } from "commander";

export const pushCommand = new Command()
  .command("push")
  .description("push codebase info to notion")
  .option("-a, --analyze", "analyze before push", false)
  .action(async (options: { analyze: boolean }) => {
    console.log("🧪", " in push/index: ", "analyze: ", options.analyze);
    if (options.analyze) {
      console.log("🧪", " in push/index: ", "called with analyze option");
    }
  });
