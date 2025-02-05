# Backend

## Basics
- [Quick Start](#quick-start)
- [Dependencies](#dependencies)
- [Swagger](#swagger)
- [Database](#database)
- [Structure](#structure)


## Quick Start
Before starting, you will need to install all the [dependencies](#dependencies) and have a basic understanding of the app outlined in [basics](#basics). Once you have done that, you can run the app using the following command:
```bash
docker-compose up --build
```
You can then access the app at **[http://localhost:3000](http://localhost:3000)**


## Dependencies
You will need the following dependencies to run the app
- [node.js](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [docker](https://docs.docker.com/compose/install/)

Additionally, you will need to install the MikroORM CLI using the following command:
```bash
npm install @mikro-orm/cli
```


## Swagger
The app will be documented using Swagger. This will let you see all the endpoints and their parameters, along with a easy way to test them. You can access the Swagger UI at
**[http://localhost:3000/api](http://localhost:3000/api)**

Most of the endpoints will result in **unauthorized** and will require a **JWT token** to access. You can get a token by using either the **/auth/signup** or **/auth/login** endpoint. You can then **authorize** in the top corner of the Swagger UI, allowing you  to access all the endpoints.


## Database
We are using a **PostgreSQL** database, along with **MikroORM** as the ORM. This will allow us to easily interact with the database using TypeScript without having to write raw SQL queries. The database automatically spins up when you run the app using [quick start](#quick-start).

Whenever you make changes to the entities, you will need to update the schema. This can be done by running the following command:
```bash
npx mikro-orm schema:create --dump   # Dumps create schema SQL
npx mikro-orm schema:update --dump   # Dumps update schema SQL
npx mikro-orm schema:drop --dump     # Dumps drop schema SQL
```
This will generate the needed SQL code for the database, which you can then update the [schema.sql](./schema.sql) file with. 

**Docker WILL keep the old database**, so you will need to remove the old database using the following commands:
```bash
docker-compose down ## If the app is running
docker volume rm $(docker volume ls -q | grep postgres_data)
```
You can then run the app again using `docker-compose up --build`.

Finally, if you want to access the database yourself you can use the following command:
```bash
docker exec -it postgres_db psql -U devuser -d devdb
```


## Structure
This is a whole another topic which will be covered in the [structure](./structure.md) file. This will cover the structure of the backend, along with the different layers and how they interact with each other.

