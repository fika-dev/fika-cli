
![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/25ade389-9383-4054-b7f0-d768ceec7314/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220907%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220907T042643Z&X-Amz-Expires=86400&X-Amz-Signature=b0228d160cdfd5f8689d52ee565bd2437ef4f1a50c474c627050a94087da5bd8&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

# Fika: A high-level git extension that helps team-shared development workflow.

## Overview

---

Git is at the heart of the development workflow.

Git is great tool and in modern development we can not survive without it.

But it can be scary and hard for even experienced developers.

> **Maxine is still the only person who knows every keyboard shortcut from vi to the latest, greatest editors. But she is never ashamed to tell anyone that she still needs to look up nearly every command line option for Git—because Git can be scary and hard! What other tool uses SHA-1 hashes as part of its UI?** _from Unicorn Project, Gene Kim_

The goal of this extension is to make it simple to configure and share team-based git workflow strategy and to make teammates easy to follow the configured strategy.

Also Fika provides integration with issue tracking tools (e.g. Notion, Jira) and with github.

With Fika, no more manual creation of issue and pull request and manual linking with issue tracking tools.

## Get Started

---

### `fika init`

You can generates sharable git-workflow configuration file named `.fikarc` inside the repository by answering some questions.

https://user-images.githubusercontent.com/4794433/188790557-a9f5af23-db78-4672-b537-d47c99d4696d.mov


### `fika start <issue-url>`

You can start handling of the issue given as url from issue tracking tool (IST), inside automatically created feature branch for this issue.

https://user-images.githubusercontent.com/4794433/188790487-54a463c4-4a5e-4889-9900-43cc9ef71651.mov

This command executes a below sequence.

1. It collects information of the issue (title) from IST (such as Notion or Jira).
2. It creates github repository issue (e.g. #236) with same title, and leave link for url of original issue from IST.
3. It appends github repository issue link to IST issue document.
4. It creates a local feature branch following name convention configured by `.fikarc` file.
5. Checkout to the created local feature branch to start handling the issue.

### `fika finish`

You can finish handling of the current issue, and share result with team.

https://user-images.githubusercontent.com/4794433/188790582-da392cd7-6049-4045-b15a-37ab40520aae.mov

This command executes a below sequence.

1. It will pull base branch and check merge conflict.
2. It will push this local feature branch to remote repository.
3. It will create github pull request (with same name with issue).
4. It will link github pull request to original issue from IST.
5. Checkout to base branch depending on the configuration.

### other commands

- `fika d` : Checkout to the develop branch (or the name of the develop branch specified by the user in `.firarc`)
- `fika f` : Checkout to the most recent feature branch, base on the naming scheme gave by the user.
- `fika f <issue_number>` : Checkout to the feature branch handling that issue number.
- `fika info` : Display information about an issue being handled in this feature branch : its branch name, title, GitHub url link and PR url link if was created.

## Installation

---

### 1) Preinstallation

To use **fika**, `gh` a client tool of **github**, needs to be installed in advance.

Installing `gh` is easy!

You can install

by running `brew install gh` for macos,

by `choco install gh` or `winget install --id GitHub.cli` for windows.

You can check in more details from below link.

[https://github.com/cli/cli#installation](https://github.com/cli/cli#installation)

<aside>
💡 And installation, do not forget to log in to github through `gh auth login`

</aside>

### 2) Installation of fika

```bash
npm install -g fika-cli
```

### 3) Connect to issue tracking tool

```bash
# for notion
fika connect notion
# for jira
fika connect jira
```
