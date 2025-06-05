
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { AppDataSource } from '../database/data-source';
import { UserFactory } from './user.factory';
import { UserSeeder } from './user.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...AppDataSource.options,
  factories: [UserFactory],
  seeds: [UserSeeder],
};

const dataSource = new DataSource(options);

void dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  console.log('Seeding finished');
  process.exit();
});
