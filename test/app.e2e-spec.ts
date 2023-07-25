import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PAGINATION_SIZE, PROPERTY_RESPONSE_TEXT } from '../src/constants';
import { Property } from '../src/properties/entity/property.entity';
import { seedDb } from '../src/database/database.seed';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const dataSource = app.get(getDataSourceToken());
    await seedDb(dataSource);

    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app.close();
  });

  describe('properties', () => {
    describe('/properties (POST)', () => {
      const validPropertyDto = {
        address: '22690 West Hunters Hollow Garden #LPH-1',
        price: 9199166,
        bedrooms: 4,
        bathrooms: 2,
        type: 'Townhouse',
      };

      it('should create and return a property', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send(validPropertyDto)
          .expect(201)
          .then(({ body }) => {
            expect(body.status).toEqual(201);
            expect(body.response).toEqual(PROPERTY_RESPONSE_TEXT.CREATE);
            expect(body.data).toEqual({
              ...validPropertyDto,
              deletedAt: null,
              id: expect.any(Number),
            });
          });
      });

      it('should fail to create a property without address', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send({ ...validPropertyDto, address: undefined })
          .expect(400);
      });

      it('should fail to create a property without price', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send({ ...validPropertyDto, price: undefined })
          .expect(400);
      });

      it('should fail to create a property without bedrooms', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send({ ...validPropertyDto, bedrooms: undefined })
          .expect(400);
      });

      it('should fail to create a property without bathrooms', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send({ ...validPropertyDto, bathrooms: undefined })
          .expect(400);
      });

      it('should allow to create a property without type', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send({ ...validPropertyDto, type: undefined })
          .expect(201);
      });

      it('should allow to create a property with null type', () => {
        return request(app.getHttpServer())
          .post('/properties')
          .send({ ...validPropertyDto, type: null })
          .expect(201);
      });
    });

    describe('/properties (GET)', () => {
      it('should get paginated properties', () => {
        const page = 1;
        const limit = 100;
        return request(app.getHttpServer())
          .get('/properties')
          .query({
            page,
            limit,
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.status).toEqual(200);
            expect(body.response).toEqual(PROPERTY_RESPONSE_TEXT.FIND);
            expect(body.data).toHaveProperty(
              'items',
              expect.any(Array<Property>),
            );
            expect(body.data).toHaveProperty('meta.currentPage', page);
            expect(body.data).toHaveProperty('meta.itemsPerPage', limit);
            expect(body.data).toHaveProperty(
              'meta.itemCount',
              expect.any(Number),
            );
            expect(body.data).toHaveProperty(
              'meta.totalItems',
              expect.any(Number),
            );
            expect(body.data).toHaveProperty(
              'meta.totalPages',
              expect.any(Number),
            );
          });
      });

      it('should get first page and default limit if none is specified', () => {
        return request(app.getHttpServer())
          .get('/properties')
          .expect(200)
          .then(
            ({
              body: {
                data: { meta },
              },
            }) => {
              expect(meta).toHaveProperty('currentPage', 1);
              expect(meta).toHaveProperty('itemsPerPage', 10);
            },
          );
      });

      it(`should return no more than ${PAGINATION_SIZE.MAX_ITEMS} results per page`, () => {
        return request(app.getHttpServer())
          .get('/properties')
          .query({ limit: PAGINATION_SIZE.MAX_ITEMS + 1 })
          .expect(400);
      });
    });

    describe('/properties/:id (GET)', () => {
      it('should return one property with the given id', () => {
        const propertyId = 1;
        return request(app.getHttpServer())
          .get(`/properties/${propertyId}`)
          .expect(200)
          .then(({ body: { data } }) => {
            expect(data).toHaveProperty('id', propertyId);
          });
      });

      it('should fail if there is no property', () => {
        const propertyId = 0;
        return request(app.getHttpServer())
          .get(`/properties/${propertyId}`)
          .expect(404);
      });
    });

    describe('/properties/:id (PATCH)', () => {
      it('should update the property with the given id', () => {
        const propertyId = 1;
        const newAddress = 'a new address';
        const updatePropertyDto = {
          address: newAddress,
        };
        return request(app.getHttpServer())
          .patch(`/properties/${propertyId}`)
          .send(updatePropertyDto)
          .expect(200)
          .then(({ body: { data } }) => {
            expect(data).toHaveProperty('id', propertyId);
            expect(data).toHaveProperty('address', newAddress);
          });
      });

      it('should fail if there is no property', () => {
        const propertyId = 0;
        return request(app.getHttpServer())
          .get(`/properties/${propertyId}`)
          .expect(404);
      });
    });

    describe('/properties/:id (DELETE)', () => {
      it('should soft remove the property with the given id', () => {
        const propertyId = 1;
        return request(app.getHttpServer())
          .delete(`/properties/${propertyId}`)
          .expect(200)
          .then(({ body: { data } }) => {
            expect(data).toHaveProperty('id', propertyId);
            expect(data).toHaveProperty('deletedAt', expect.any(String));
          });
      });

      it('should fail if there is no property', () => {
        const propertyId = 0;
        return request(app.getHttpServer())
          .get(`/properties/${propertyId}`)
          .expect(404);
      });
    });
  });
});
