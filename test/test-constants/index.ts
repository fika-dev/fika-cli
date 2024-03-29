import { issueNumberTag } from "@/config/constants/default_config";
import { AddOnType } from "@/domain/entity/add_on/add_on.entity";
import { Config } from "src/domain/entity/config.entity";
import { ObjectType } from "src/domain/entity/dev_object.entity";

// export const TEST_NOTION_WORKSPACE_ID = '6e9f6c0d-9018-43cf-8081-9ddb21368fc2';
export const TEST_NOTION_WORKSPACE_ID = 'd3224eba-6e67-4730-9b6f-a9ef1dc7e4ac';

export const TEST_ISSUE_BRANCH_TEMPLATE = `feature/iss/#${issueNumberTag}`

export const TEST_JIRA_WORKSPACE_ID = '275b18d8-c1b6-4b30-940a-529e6f3e5235';

export const TEST_USER_HASH = '5387961cb9c99be489af15acc544bf74c5df625305726ff4c1b3dfb104fd482558326a76';

export const TEST_START_DOC_URL = 'https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd';

export const TEST_STARTED_DOC_URL = 'https://www.notion.so/test-fika-started-doc-4ssdfasd4efb448483fe3e2b703d50fd';

export const TEST_START_DOC_JIRA_URL = 'https://fika-dev.atlassian.net/browse/FB-1';

export const TEST_START_ISSUE = {
  gitIssueUrl: undefined,
  issueUrl: 'https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd',
  title: 'test fika start doc',
  body: 'Notion Document: https://www.notion.so/test-fika-start-doc-4af459df4efb448483fe3e2b703d50fd',
  labels: []
};

export const TEST_CI_DOC_ID = 'https://www.notion.so/test-document-8d3ec82f2fc14b64b150f298c48598ae';

export const TEST_CPR_DOC_ID =  'https://www.notion.so/for-pull-request-test-document-643f1f31906d498c8556d92fc1c614dc'

export const TEST_CPR_BRANCH_NAME = 'feature/iss/#2';

export const TEST_HTTPS_GITHUB_REPO = 'https://github.com/fika-dev/fika-cli-test-samples.git';

export const TEST_GITHUB_URL = 'https://github.com/fika-dev/fika-cli-test-samples';

export const TEST_SSH_GITHUB_REPO = 'git@github.com:fika-dev/fika-cli-test-samples.git';

export const TEST_UNVALID_BRANCH_NAME = 'feature is not';

export const TEST_CPR_COMMIT_MESSAGE = '[add] meaningless white space';

export const TEST_CHANGE_FILE_PATH = './test/testing-env/fika-cli-test-samples/sample_01/readme.md';

export const TEST_GIT_VERSION_OUTPUT = 'git version 2.32.1 (Apple Git-133)';

export const TEST_GH_VERSION_OUTPUT = `gh version 2.14.7 (2022-08-25)
    https://github.com/cli/cli/releases/tag/v2.14.7 


    A new release of gh is available: 2.14.7 → 2.16.0
    To upgrade, run: brew upgrade gh
    https://github.com/cli/cli/releases/tag/v2.16.0`;

export const TEST_GIT_PULL_UPDATED_OUTPUT = `From https://github.com/fika-dev/fika-cli-test-samples
* branch            develop    -> FETCH_HEAD
Updating b9d9b71..ead2b6b
Fast-forward
README.md            | 18 ++++++++++++++++++
sample_01/readme.md  | 42 ++++++++++++++++++++++++++++++++++--------
some_random_test.txt |  1 +
3 files changed, 53 insertions(+), 8 deletions(-)
create mode 100644 README.md
create mode 100644 some_random_test.txt`;

export const TEST_GIT_PULL_NO_CHANGE_OUTPUT = `From https://github.com/fika-dev/fika-cli-test-samples
* branch            develop    -> FETCH_HEAD
Already up to date.`;


export const TEST_GIT_PULL_CONFLICT_OUTPUT = `From
* branch            develop    -> FETCH_HEAD
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.`;

export const TEST_GIT_PULL_NO_REMOTE_REF_OUTPUT = `fatal: couldn't find remote ref conflicting_234`;

// NEED TO BE APPLIED TO TEST
export const TEST_GIT_PULL_UNRESOLVED_MERGE_OUTPUT = `error: Pulling is not possible because you have unmerged files.
hint: Fix them up in the work tree, and then use 'git add/rm <file>'
hint: as appropriate to mark resolution and make a commit.
fatal: Exiting because of an unresolved conflict.`;

// NEED TO BE APPLIED TO TEST
export const TEST_GIT_PULL_UNRESOLVED_MERGE_OUTPUT_2 = `error: You have not concluded your merge (MERGE_HEAD exists).
hint: Please, commit your changes before merging.
fatal: Exiting because of unfinished merge.`;

export const TEST_GIT_PUSH_OUTPUT = `Enumerating objects: 17, done.
Counting objects: 100% (17/17), done.
Delta compression using up to 8 threads
Compressing objects: 100% (9/9), done.
Writing objects: 100% (9/9), 1.02 KiB | 1.02 MiB/s, done.
Total 9 (delta 7), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (7/7), completed with 7 local objects.
To https://github.com/fika-dev/fika-cli.git
   0c748be..5211e06  feature/iss/#442 -> feature/iss/#442`

export const TEST_GIT_GET_CURRENT_BRANCH_OUTPUT = `feature/iss/#440
`;

export const TEST_CURRENT_BRANCH_WITH_REMOTE = 'feature/iss/#412'

export const TEST_GIT_REPO_PATH = "/Users/testuser/Fika/fika-cli";

export const TEST_GIT_ABORT_MERGE_FAILED_OUTPUT = 'fatal: There is no merge to abort (MERGE_HEAD missing).';
export const TEST_GET_ABORT_MERGE_SUCCESS_OUTPUT = 'Merge aborted successfully.';
export const TEST_GH_VERSION_ONE_LINE_OUPUT = 'gh version 2.14.7 (2022-08-25)';

export const TEST_NOT_INSTALLED = 'command not found:';

export const TEST_GIT_STASH_NORMAL_OUTPUT = 'Saved working directory and index state WIP on #430: e80ea84 fix';

export const TEST_GIT_STASH_APPLY_NORMAL_OUTPUT = `On branch feature/iss/#430
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/command/checkout-feature-branch/checkout-feature-branch.action.ts
	modified:   src/config/constants/default_config.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	test/domain/git-command/command.functions.test.ts

no changes added to commit (use "git add" and/or "git commit -a")`;

export const TEST_GIT_STASH_APPLY_ERR = `test/domain/git-command/command.functions.test.ts already exists, no checkout
error: could not restore untracked files from stash`

export const TEST_BRANCH_LIST = `
develop
feature/iss/#138
feature/iss-#138
feature/iss-#140
feature/iss-105
feature/iss-107
feature/iss-109
feature/iss-111
feature/iss-113
feature/iss-115
feature/iss-117`

export const TEST_NOT_LOCAL_BRANCH = 'feature/iss/#409';

export const TEST_NOT_LOCAL_BUT_REMOTE_BRANCH = 'feature/iss/#412';

export const TEST_HEAD_NOT_DEFINED = `
HEAD
fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'`

export const TEST_GIT_STATUS_STRING = `
On branch feature/iss/#418
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/domain/git-command/parser/parser.functions.ts
        modified:   src/domain/rules/validation-rules/validate.functions.ts
        modified:   src/domain/rules/validation-rules/validation-rules.functions.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        test/domain/

no changes added to commit (use "git add" and/or "git commit -a")
`

export const TEST_GIT_STATUS_WITH_STAGED = `
On branch feature/iss/#418
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/domain/git-command/parser/parser.functions.ts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/domain/git-command/parser/parser.values.ts
        modified:   test/domain/rules/validation-rules/validate.function.test.ts
        modified:   test/test-constants/index.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        test/domain/git-command/
`

export const TEST_GIT_MERGE_CONFLICT_STATUS = `
On branch conflicting
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   sample_01/readme.md

no changes added to commit (use "git add" and/or "git commit -a")`

export const TEST_GIT_NO_REMOTE = `
error: No such remote 'origin'`

export const TEST_GIT_CLEAN_STATUS = `
On branch feature/iss/#418
nothing to commit, working tree clean`

export const TEST_NO_COMMIT_STATUS = `
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
`

export const TEST_BRANCH_SORTED = `feature/iss/#2
develop
something
feature/iss/#406
feature/iss/#1507
feature/iss/#912
conflicting
main
`

export const TEST_REMOTE_BRANCHES = `  origin/develop
origin/feature/iss/#2
origin/feature/iss/#412
`

export const TEST_USER_CONFIG: Config = {
  workspace: {
    "id": TEST_NOTION_WORKSPACE_ID,
    "workspaceName": "원모's Notion",
    "workspaceType": "notion",
    "workspaceIcon": "https://s3-us-west-2.amazonaws.com/public.notion-static.com/11ee3c37-db45-447b-855a-6df75df2bf32/notion_fika_logo.png",
  },
  fikaToken: {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiIwMGZlMzFmMC1lZmE2LTRiZDMtYjU4MS1mNGVmZWMwOTA3ZTkiLCJpYXQiOjE2NTcwNzMwMjR9.6KWxLb87PDbnbB0cI9QZXaJ51Xuf8j1uKnuoWuEhxhc"
  },
  addOns: [
    {
      name: "Repo.Analyzer",
      type: AddOnType.Analyzer,
      objectType: ObjectType.Repo,
      databaseName: "Repository Database",
      additionalProperties: [],
    },
    {
      name: "React.Component.Analyzer",
      type: AddOnType.Analyzer,
      objectType: ObjectType.Component,
      databaseName: "React Component Database",
      additionalProperties: [],
    },
    {
      name: "Typescript.Morpher",
      type: AddOnType.Morpher,
    },
    {
      name: "Github.GitPlatform",
      type: AddOnType.GitPlatform,
    },
  ]
}


export const OLD_TEST_CONFIG = `
{
  "notionWorkspace": {
      "id": "bb7f974c-aac1-4b38-89d0-9caa4bfaecba",
      "botId": "d3224eba-6e67-4730-9b6f-a9ef1dc7e4ac",
      "name": "원모's Notion",
      "icon": "https://s3-us-west-2.amazonaws.com/public.notion-static.com/11ee3c37-db45-447b-855a-6df75df2bf32/notion_fika_logo.png",
      "owner": {
          "object": "user"
      }
  },
  "addOns": [
      {
          "name": "Repo.Analyzer",
          "type": 0,
          "objectType": 0,
          "databaseName": "Repository Database",
          "additionalProperties": []
      },
      {
          "name": "React.Component.Analyzer",
          "type": 0,
          "objectType": 1,
          "databaseName": "React Component Database",
          "additionalProperties": []
      },
      {
          "name": "Typescript.Morpher",
          "type": 1
      },
      {
          "name": "Github.GitPlatform",
          "type": 2
      }
  ],
  "fikaToken": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Indvbm1vLmp1bmdAa2tpcmkuYXBwIiwic3ViIjoiZGUyMDRkYjYtNTU3My00OGIyLTk1YWUtZjFkMDhmZWY4YmU4IiwiaWF0IjoxNjU1MzY3ODA0fQ.iMZzFoVxhWkQA35PCCsILyK483oImZcmsujh2X-v0I8"
  },
  "git": {
      "baseBranch": "develop",
      "issueBranchTemplate": "feature/iss/#<ISSUE_NUMBER>"
  }
}
`