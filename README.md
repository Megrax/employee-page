# Employee Page

> This is my implementation of [bytebase/interview/103_employee_page](https://github.com/bytebase/interview/tree/main/103_employee_page).
> 
> <a href="./design-doc.md">Design Doc</a>

## Project Tech Stack

`Vue 3` + `TypeScript` + `Tailwind CSS` + `Daisy UI` + `Pinia` + `Vite`

## Two Ways of Employee Modification Workflow

### Create a Pull Request manually

1. Fork this repository or create a new branch if you have writing access.
2. Make changes to the employee information, then create a Pull Request.
3. Once the Pull Request is merged, Vercel will redeploy the employee page.

### Operate on the page directly

> Note: In this way, you can have at most one pending Pull Request of each employee/department.

#### Add or modify an employee's information

1. Login to the app.
2. Click the plus button to add a new employee, or click on the employee you want to modify on and then click on the edit icon.
3. Fill the form with the new information.
4. Click `Request` button to create a Pull Request automatically.

#### Delete an employee's information

1. Login to the app.
2. Click on the employee you want to delete.
3. Click on the delete icon.
4. Press `Confirm` button to create a Pull Request automatically.

#### Modify a department's information

1. Login to the app.
2. Click on one of the department member and go to the department page following the link.
3. Click on the edit icon.
4. Fill the form with the new information.
5. Click `Request` button to create a Pull Request automatically.

## Authentication

- This page's authentication is simply implemented by using `navigation guards` of `Vue Router`. Any attempts to visit employee information without logging in will be redirected to login page. 
- Visitors can only login with a valid pair of `username` and `password` specified in `secrets.json`.
- The `loggedIn` state was maintained by browser's `sessionStorage`, which performs an automatic logout when the user closes the tab or browser.

## Instructions on Development

1. Clone this repository to your local machine.
2. Run `yarn` to install dependencies.
3. Add a `.env.local` file to the root directory, which should contain a GitHub token having access to this repo.
4. Run `yarn dev` to start the development server.