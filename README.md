## Decisions

As the provided code was only boilerplate I decided to use NestJS as the framework for implementing this solutions. NestJS was chosen mainly because of:

- Easy TypeORM integration
- Easy Swagger integration
- Fully TypeScript support
- Out-of-the-box data validation
- Out-of-the-box error handling
- Great CLI for generating boilerplate code

This project uses the Controller-Service-Repository pattern.

- Our controller will be mostly responsible for handling I/O, that means receive and validate user data and generate HTTP responses.
- Service is where the business logic lives. It is responsible for calling the repository for data, and returning valid data to the controller
- Repository is only responsible for dealing with the database. All database operations belong here

The `properties` folder contains a NestJS module with containing the logic related to the `property` entity. Basic CRUD operations are supported:

- Create a single property
  - All the fields are required
- Find property by ID
- Find a list of properties
  - A simple match filter for each attribute, address is a contains filter
  - Pagination is supported, there is a maximum limit of records to be returned
  - Sorting is supported on all files, ascending and descending. There is a `PropertySortByMapping` enum to avoid verbosity when defining the order/sort.
- Update a property
  - Any attribute can be updated, except the ID
- Delete a property
  - It is actually a soft delete. The `deletedAt` attribute was created to enable this feature

The `utils` folder contains reusable code: HTTP response interface and the pagination DTO

There is Swagger documentation available at the root level `/` for easier testing.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
