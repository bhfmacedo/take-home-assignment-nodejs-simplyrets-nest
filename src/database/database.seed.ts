import { DataSource } from 'typeorm';
import { Property } from '../properties/entity/property.entity';

export const seedDb = async (dataSource: DataSource): Promise<void> => {
  const { default: data } = await import('./data/seed.json');
  await dataSource.manager.insert(Property, data);
};
