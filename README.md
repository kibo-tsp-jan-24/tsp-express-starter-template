# Team Software Project Starter Template - ExpressJS

> Note: This template is heavily based on a REST API Example here:
> https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-express.

This example shows how to implement a basic app using:

- [Express](https://expressjs.com/) 
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) as the ORM
- A SQLite database file with some initial dummy data which you can find at [`./prisma/dev.db`](./prisma/dev.db)
- [Bootstrap](https://getbootstrap.com/) for basic CSS Styling.
- [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) for unit testing
- [ESLint](https://eslint.org/) to statically analyze your code and find problems
- [Prettier](https://prettier.io/) to format your code

It is intended to serve as a starting point for your Team Software Project course if you choose to use ExpressJS. It
provides examples for performing basic tasks with different types of endpoints (GET, POST, etc.)

## Getting started

### 1. Download example and install dependencies

Clone this repository:

git clone git@github.com:kiboschool/tsp-express-starter-template.git

Install npm dependencies:

```bash
cd tsp-express-starter-template
npm install
```

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are
defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```bash
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in
[`prisma/seed.js`](./prisma/seed.js) will be executed and your database will be populated with the sample data.

### 3. Interacting with the Starter Template

```bash
npm run dev
```

The server is now running on `http://localhost:3000`. You can send the API requests implemented in `index.js`, e.g.
[`http://localhost:3000/feed`](http://localhost:3000/feed).

## Using the Starter Template

- Visit `http://localhost:3000` to be presented with the login page.
- If you have seeded the database per the above instructions, you can use one of the logins from `prisma/seed.js` to log
  in.
- Click on the `Register here` link to create a new user.

Once logged in, you can see that user's posts. Posts have Titles and Contents.

### Additional Commands

**ESLint configuration is stored in the '.eslintrc.json' file.**

Check if the formatting matches Prettier’s rules by using:

``` bash
npm run format:check
```

Apply the formatting recommendations using this command:

``` bash
npm run format:write
```

**Prettier configuration is stored in the '.prettierrc.json' file.**

Lint your code with ESLint using this command:

``` bash
npm run lint:check
```

Auto-fixing errors with this command:

``` bash
npm run lint:fix
```

Run unit tests with this command:

```bash
npm run tests
```
