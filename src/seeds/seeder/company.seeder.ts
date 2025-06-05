
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Company } from '../../company/entities/company.entity';

export class CompanySeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = factoryManager.get(Company);
    const users = await userFactory.saveMany(2); 

    const userRepo = dataSource.getRepository(Company);
    await userRepo.save(users);

    console.log('Seeded Users:', users);
  }
}
