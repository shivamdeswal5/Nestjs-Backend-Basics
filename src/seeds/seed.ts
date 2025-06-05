
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { AppDataSource } from '../database/data-source';
import { UserFactory } from './factory/user.factory';
import { UserSeeder } from './seeder/user.seeder';
import { CompanyFactory } from './factory/company.factory';
import { CompanySeeder } from './seeder/company.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...AppDataSource.options,
  factories: [UserFactory,CompanyFactory],
  seeds: [UserSeeder,CompanySeeder],
};

const dataSource = new DataSource(options);

void dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  console.log('Seeding finished');
  process.exit();
});
