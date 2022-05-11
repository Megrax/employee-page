# Design of Employee Page

> Megrax @2022-5

## Overview

Management of employees' personal information is just indispensable for companies and teams.  As a minimum usable employee page product, this project should support these requirements:

- Users can view, edit and delete employee information, as well as departments'.
- Users can easily find an employee by searching.
- Users should have control over public access.
- The workflow should be easy to use, even without a custom server or backend.

## Design

### Data Storage and Structure

Employee information needs to be persistently stored, and I'm using a configuration file for this. With full use of Git, it will be convenient both in data changing and version control.

JSON was chosen to be the format of configuration file. Because it's not only very human readable, but also a full-fledged data structure for storing data. Compared to YAML or TOML , it's born following JavaScript's object syntax, easy to manipulate data with JS.

The structure of `data.json` is as follows:

```jsonc
{
  "title": "team title",
  "teamSlogan": "team slogan",
  "departments": [
    {
      "name": "department name",
      "description": "department description",
      "members": [
        "member id"
      ]
    },
    ... other departments ...
  ],
  "employees": [
    {
      "name": "employee name",
      "id": "employee id",
      "position": "employee position",
      "department": "employee department",
      "bio": "employee bio",
      ... other possible details ...
      "detail": {
        "phone": "123456789",
        "address": "123 Fake Street, Fake City, Fake Country"
        ... other possible details ...
      }
      ... other employees ...
    },
  ]
}
```

- The entire structure is made up of basic information about the team and lists of employees/departments.
- The department `name` is used as an identifier. Multiple departments cannot have duplicated names. This is the same for employee `id`.
- Basic employee information (those not included in the `detail`) are mandatory, but it's up to users on deciding what exact attributes to use. You are free to add an `age` attribute or remove the `address` if you like.
- This structure is designed to be highly customizable. More or less attributes are accepted without changing the underlying skeleton.

### Modification Workflow

All modifications end up changing `data.json`. So the whole workflow can be based on the famous [Git workflow](https://docs.github.com/en/get-started/quickstart/github-flow) : 

|       | Git Workflow                                | Employee Page Workflow                                           |
| :---: | :------------------------------------------ | :--------------------------------------------------------------- |
|   1   | **Create a new branch**.                    | **Create a new branch**, specifying what to changed in the name. |
|   2   | Apply **file changes** on the branch.       | **Make changes to `data.json`** on the branch.                   |
|   3   | **Create a Pull Request** to merge changes. | **Create a Pull Request** to merge changes.                      |
|   4   | Accept the changes by **merging PR**.       | Accept the changes by **merging PR**.                            |

Thanks to [GitHub REST API](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api)s, the whole process can be done by programmatically sending some requests. Although the project is hosted on GitHub, users no longer clone and commit at code level. Instead, changes happen directly on the page. If the user wants to add or edit something, a modal with an embedded editor pops up. With a simple click to confirm, requests will be automatically sent out for a new PR. And due to modern deployment platforms like [Vercel](https://vercel.com), a preview deployment will be available for maintainers just in minutes.

#### Handling Conflicts

Conflicts on file changes is something inevitable for Git-based projects, which should be under consideration. In this project, users can create **at most one** Pull Request for each employee/department's change. If there has been a pending PR related to an employee/department already, users cannot edit it until the pending PR is resolved.

In this way, we "dodge" conflicts.

### Authentication

- Authentication for this project is achieved through the `navigation guards` of `Vue Router`. Any attempt to access employee/department information without logging in will be redirected to the login page.
- Visitors can only login with a valid pair of `username` and `password` specified in `secrets.json`.
- The `loggedIn` state is maintained by browser's `sessionStorage`, which performs an automatic logout when the user closes the tab or browser.

### UI

As this page is a pure front-end project, design of UI takes the lion's share. I'm using a fairly modern frontend tech stack on UI development: `Vue 3` as JavaScript framework, `TypeScript` for type support, `Tailwind CSS` for easy-to-use style utilities, and `Vite` for lightning fast dev server. All these options make development an easy and fast process, ensuring rapid prototype implementation and version iterations.

#### Routes

According to requirements, this project should have basically four pages:

- One for employees' info modification, with route `/member/<employee id>`.
- One for departments' info modification, with route `/dep/<department name>`.
- One for control over public access, with route `/login`.
- And an entry page, with route `/overview`, where it displays all employees and a searching bar.

Irrelevant routes should be redirected back to entry.

#### Layout

Each page has a well-designed layout that is both beautiful and easy to use.

- **overview** page:
  
  - Has a horizontal centered layout with team title and slogan on the top.
  
  - A grid list of employees following a search input.
  
  - An "add new one" button displays at an intuitive position where the next employee is supposed to be.

- **member** and **department** page:
  
  - Has a same horizontal centered layout with properly aligned information list.
  
  - There's a useful tool bar on the left, which is the entry for operations like going back or info editing.

- other layouts:
  
  - There's a reminder at the top right of each page showing the number of pending PRs. This reminds the user to process the pending PRs as soon as possible.

#### Functional Components

This project uses beautifully styled modal and button components from `Daisy UI` to handle user interaction. Inside the modal is an embedded `ace-editor` to record changes. Uses `vue-starport` for animation between routes and `vue-boring-avatar` for avatar presentation, which can be replaced with real-world image links in production environment.

## Technical Solutions

### Searching

Searching in the overview page is a necessary feature to find employees quickly, especially when the number of employees is relatively large.

From the perspective of developer, all displayed employees are a set of filtered result. Initially the filtering condition is empty, so all employees are shown. When users input filtering conditions, the set of filtered result changes as well, which will cause the view to change.

The "filtering process" itself is implemented by checking string inclusion relationships. Each employee's information will be stringified into a string, and we pick out employees whose information string contains the filtering condition string.

In addition, using vue's built-in modifier `.lazy` reduces unnecessary computation on user input.

### File Changing

The process of changing `data.json` contains the following steps:

1. Use the Ace editor to handle user input, checking syntax as well as other non syntax limits like identifiers can't repeat or basic information are required and showing error messages if any.

2. Parse legal user input and insert it into the whole object of `data.json`, replacing the old node.

3. Deal with side effects possibly generated in step 2, like making changes to departments' member list.

4. Stringify the whole object of `data.json` into JSON string, the following extra parameters are needed to make it formatted for better Git diff:
   
   ```js
   const res = JSON.stringify(object, null, 2);
   ```

5. Finally, after base64 encoding, send the string to GitHub server in order to create a commit.

### Button States

From users' first click onto the request button, to new PR's successfully creation, the request button has five states in total: idle, creating branch, creating commit, creating Pull Request and finally done.

The change of button states is implemented by sequential request sending and response result listening. This uses an async-await paradigm to achieve code simplicity.

```ts
let requestStage.value = 'idle';
...
const handleRequest = async () => {
    ...
    requestStage.value = 'branching';
    await createBranch(...);
    requestStage.value = 'committing';
    await createCommit();
    requestStage.value = 'pulling';
    await createPR();
    requestStage.value = 'done';
    ...
}
```

## Future Enhancement

- Better authentication, this `router navigation guards` based protection is not secure enough to be used in real-world public production environment. Try HTTP basic auth or other possible solutions.

- Support highly customizable themes, different users can use their favorite UI design style.

- Better user interaction. Replace the current editor interaction with something similar to Ant Design's FormList, which is easier to understand and use for both developers and non-developers.
