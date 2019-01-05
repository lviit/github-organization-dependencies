# github-organization-dependencies

Find out what npm packages your organization is using. Looks for dependencies in package.json files for repositories where the dependency graph is enabled.

If you want to run this locally, you need to create a new Github OAuth App (instructions [here](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)). Then add your app client ID and secret ot an .env file in the repo root:
```
GITHUB_CLIENT_ID=xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxx
```

Stuff used: 
- Github GraphQL API v4 
- React
- Apollo
- Express
- Chart.js
- Ramda
- Styled components

