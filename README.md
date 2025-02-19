
# Globe Gram

(WIP - layout info.)

  

We are a social travel-planning app. Users planning a trip can be inspired by other travelers’ diaries around that destination, filtering the map according to their budget. Travelers may upload and tag their photos with ease, receive a comprehensive travel diary in return, and share their diary on the map to inspire others.

  

# Our Goals

Our target customers are travelers. Our app offers solutions for 2 problems travelers face:

  

1) When planning a trip, one often doesn’t know all that they want to do nor all that’s available at their destination. Our app will show users other travelers’ photos at nearby spots for inspiration, accompanied with planning information like pricing, etc.

  

2) During a trip, days are full of adventure, so there remains little time to preserve these moments’ details in writing, for example. Given photos and tags, our app will return a travel diary. Optionally, users can share these to inspire others.

  
  

# Living Document

https://docs.google.com/document/d/1QPL-KpL8HGXZmXVWRMLAcBoYqu4GowHgW0gimDIc_YU/edit?usp=sharing

  

# Style Guides

- TypeScript: https://ts.dev/style/. Automated linter: ESLint with a TypeScript configuration (@typescript-eslint).

- TypeScript in NestJS built on ESLint (automatic linter/formatter): https://awesome-nestjs.com/components-and-libraries/lint.html.

- Python: https://peps.python.org/pep-0008/. Automated linter: flake8. Automated formatter: Black.

- SQL: https://docs.telemetry.mozilla.org/concepts/sql_style.html. Automated formatting: https://sqlfluff.com/.

## Getting It Running

- [Dependencies](#dependencies)

- [Quick Start](#quick-start)

- [Swagger](#swagger)

- [Database](#database)

- [Structure](#structure)

  
  

## Dependencies

You will need the following dependencies to run the app

- [Node.js](https://nodejs.org/en/download)

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- [Docker](https://docs.docker.com/compose/install/)

- [Expo CLI](https://docs.expo.dev/more/expo-cli/).

  

Additionally, you will need to install the MikroORM CLI using the following command:

```bash

npm  install  @mikro-orm/cli

```
  
  

## Quick Start

In [I'm a relative reference to a repository file](../main/frontend), run:

```bash

docker-compose  up  --build

```

You can then access the app at **[http://localhost:3000](http://localhost:3000)**

  
  

## Swagger

The app will be documented using Swagger. This will let you see all the endpoints and their parameters, along with a easy way to test them. You can access the Swagger UI at

**[http://localhost:3000/api](http://localhost:3000/api)**

  

Most of the endpoints will result in **unauthorized** and will require a **JWT token** to access. You can get a token by using either the **/auth/signup** or **/auth/login** endpoint. You can then **authorize** in the top corner of the Swagger UI, allowing you to access all the endpoints.

  
  

## Database

We are using a **PostgreSQL** database, along with **MikroORM** as the ORM. This will allow us to easily interact with the database using TypeScript without having to write raw SQL queries. The database automatically spins up when you run the app using [quick start](#quick-start).

  

Whenever you make changes to the entities, you will need to update the schema. This can be done by running the following command:

```bash

npx  mikro-orm  schema:create  --dump  # Dumps create schema SQL

npx  mikro-orm  schema:update  --dump  # Dumps update schema SQL

npx  mikro-orm  schema:drop  --dump  # Dumps drop schema SQL

```

This will generate the needed SQL code for the database, which you can then update the [schema.sql](./schema.sql) file with.

  

**Docker WILL keep the old database**, so you will need to remove the old database using the following commands:

```bash

docker-compose  down  ## If the app is running

docker  volume  rm $(docker  volume  ls  -q | grep  postgres_data)

```

You can then run the app again using `docker-compose up --build`.

  

Finally, if you want to access the database yourself you can use the following command:

```bash

docker  exec  -it  postgres_db  psql  -U  devuser  -d  devdb

```

  
  

## Structure

This is a whole another topic which will be covered in the [structure](./structure.md) file. This will cover the structure of the backend, along with the different layers and how they interact with each other.