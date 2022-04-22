# fika-cli documentation

The ☕ Fika CLI allows developers to keep their Notion documents in sync with their codebase without effort.

# Quick Start

---

```bash
# 📦 Install fika cli
yarn global add fika-cli

# 🚀 Initialize fika in your repository
cd YOUR_REPO_PATH
fika init --connect

# ☕ Push your repo & registered components to your Notion workspace
fika push --analyze
```

# Table Of Contents

---

# Overview

---

## Installation

```bash
# 📦 Install fika using yarn
yarn global add fika-cli
# or with npm
npm -g install fika-cli
```

## Notion Template

[](https://www.notion.so/templates/roadmap)

Above link will lead you to **Fika** Notion template. Please duplicate this template to your Notion workspace. **Fika** tries to find relavant pages and databases in this duplicated template page.

## **Initializing**

```bash
fika init --connect
```

`fika init` with `—connect` option opens a browser with authorization URL, a prompt which discloses the capabilities of the integration with **Fika** and choose whether to grant the integration access or not.

After granting access, a page picker will be shown to select pages and databases to share with **Fika** integration. Please select the duplicated **Fika Template** page.

`fika init` initializes the Fika CLI in the current directory (RECOMMENDATION current directory == root directory of target git repo).

Running `fika init` generates a `.fika/config.json` so that you can configure various settings required for using **Fika** .

By default, fika configuration

```json
{
  // botId will be updated after connecting with Notion workspace
  "botId": "not_connected",
  "components": [
    {
      "React.Component": {
        "databaseName": "React Component DB",
        "additionalProperties": [
          {
            "description": "rich_text"
          }
        ]
      }
    }
  ]
}
```

Running `fika init` also anlayze a relevant git information such as, commit count, repo birth date and most edited files. These analyzed repository info will be uploaded to your Notion workspace when you run `fika push`.

## Registering Components

Fika currently supports only `typescript react components` and `typescript next pages` as components.

To register components please insert commented decoration `//@Fika()` like below.

```tsx
//@Fika('React.Component')
const Welcome: React.FC<WelcomeProps> = (props) => <h1>Hello, {props.name}</h1>;
```

`fika analyze` or `fika push —analyze` comands analyze code files in the initialized directory and extract registered components. The automatically extracted components will be stored in `.fika/components.g.ts` file.

The registered components will be uploaded to your Notion workspace as a page in the component database.

## Uploading data into Notion

```bash
fika push --analyze
```

`fika push` uploads extracted data to your Notion workspace (into the **Fika** template page which you granted access to **Fika** integrator ). The `—analyze` option let you upadate git repository data and analyze registered components before uploading.

Currently, fika extract data about git repository and registered components.

### Git Repository Data

| title            | fika-cli will extract title of this repository from linked remote url |
| ---------------- | --------------------------------------------------------------------- |
| latest version   | the latest git tag                                                    |
| url              | git linked remote url (usually, github origin url)                    |
| created date     | when the linked repository is created                                 |
| authors          | contributors of the linked repository                                 |
| commit count     | the count of commits                                                  |
| active days      | the count of days when commit is submmitted                           |
| file count       | the count of files of linked repository                               |
| synced commit id | the last commit id of the repository                                  |
| last synced date | when git repository data is synced                                    |

### React Component Data

| title       | the name of react component (e.g. Home, Heading, EditButton)                 |
| ----------- | ---------------------------------------------------------------------------- |
| file path   | relative path of the file including registered react component               |
| type        | declared type of the react component (if exist) (e.g. React.VFC<HomeProps> ) |
| props       | properties passed down to the react component                                |
| description | additional description                                                       |
