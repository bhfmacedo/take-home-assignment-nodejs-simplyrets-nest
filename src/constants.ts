// A file to avoid "magic strings" scattered in the code

export const PAGINATION_SIZE = {
  MAX_ITEMS: 1000,
  MIN_ITEMS: 1,
  MIN_PAGE: 1,
};

export const PROPERTY_RESPONSE_TEXT = {
  CREATE: 'Property successfully created',
  FIND: 'Property list found',
  FIND_ONE: 'Property found',
  UPDATE: 'Property successfully updated',
  REMOVE: 'Property successfully removed',
  NOT_FOUND: 'Property was not found',
};

export const SWAGGER_STRINGS = {
  TITLE: 'SimplyRETS Example',
  DESCRIPTION: 'A simple NestJS CRUD for properties',
  VERSION: '0.1',
};
