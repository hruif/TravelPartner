# Backend (Developer Guide)
Built with NestJS and PostgresSQL. 

## Table of Contents
- [Quick Start](#quick-start)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [Swagger](#swagger)
- [Database](#database)
- [Project Structure](#project-structure)


## Quick Start
There is a live version of the app running on [http://146.190.151.248:3000/](http://146.190.151.248:3000/), which you can use to test the endpoints.

To run the app locally, make sure you have installed the [dependencies.](#dependencies) Once you have done that, you can run the app using the following command:
```bash
docker compose up --build
```


## Dependencies
You will need the following dependencies to run the app
- [docker](https://docs.docker.com/compose/install/)
- [node.js](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Additionally, you will need to install the MikroORM CLI using the following command:
```bash
npm install @mikro-orm/cli
```


## Testing
**To run the tests, you can use the following command:**
```bash
npm test
```
**To create tests, there is 2 main ways:**
1. **Unit Tests** - These tests are used to test individual services/controllers. They are written using the Jest testing framework and are automatically generated as the `*.spec.ts` files using [Nest CLI](https://docs.nestjs.com/cli/overview).
2. **Integration Tests** - These tests are used to test the interaction between different parts of the app. They are written using the Jest testing framework and are placed in the `/test`, more details/conventions [here.](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)


## Swagger
The app will be documented using Swagger. This will let you see all the endpoints and their parameters, along with a easy way to test them. You can access the Swagger UI at
**[http://localhost:3000/api](http://localhost:3000/api)**

Without authorization via signing up/logging in on the auth screen, most of the endpoints will result in **unauthorized** and will require a **JWT token** to access. You can additionally get a token by using either the **/auth/signup** or **/auth/login** endpoint. You can then **authorize** in the top corner of the Swagger UI, allowing you  to access all the endpoints.


## Database
We are using a **PostgreSQL** database, along with **MikroORM** as the ORM. This will allow us to easily interact with the database using TypeScript without having to write raw SQL queries. The database automatically spins up when you run the app using [quick start](#quick-start).

Whenever you make changes to the entities, you will need to update the schema. This can be done by running the following command:
```bash
npx mikro-orm schema:create --dump   # Dumps create schema SQL
npx mikro-orm schema:update --dump   # Dumps update schema SQL
npx mikro-orm schema:drop --dump     # Dumps drop schema SQL
```
This will generate the needed SQL code for the database, which you can then update the [schema.sql](./schema.sql) file with. 


## Project Structure
The project structure is as follows:
```
backend/
│── 📂 src/                    # Main source code directory
│   │── 📂 auth/               # Authentication module (JWT, OAuth, etc.)
│   │── 📂 users/              # Users module (CRUD operations)
│   │── 📂 maps/               # Maps module (CRUD operations)
│   │── app.module.ts          # Root module
│   │── main.ts                # Entry point for the app
│   │── mikro-orm.config.ts    # MikroORM configuration
│── 📂 tests/                  # Unit and integration tests
│── 📜 .env                    # Environment variables
│── 📜 package.json            # Dependencies and scripts
│── 📜 tsconfig.json           # TypeScript configuration
│── 📜 schema.sql              # Database schema
|── 📜 docker-compose.yml      # Docker compose file
│── 📜 README.md               # Project documentation
```

