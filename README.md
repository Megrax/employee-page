# Employee Page

## Project Tech Stack

`Vue 3` + `TypeScript` + `Tailwind CSS` + `Vite`

## Employee Modification Workflow

1. Fork this repository or create a new branch if you have writing access.
2. Make changes to the employee information, then create a Pull Request.
3. Once the Pull Request is merged, Vercel will redeploy the employee page.

## Authentication

- This page's authentication is simply implemented by using `navigation guards` of `Vue Router`. Any attempts to visit employee information without logging in will be redirected to login page. 
- Visitors can only login with a valid pair of `username` and `password` specified in `secrets.json`.
- The `loggedIn` state was maintained by browser's `sessionStorage`, which performs an automatic logout when the user closes the tab or browser.

## Instructions on Development

1. Clone this repository to your local machine.
2. Run `yarn` to install dependencies.
3. Run `yarn dev` to start the development server.