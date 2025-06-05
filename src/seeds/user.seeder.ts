
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../user/entities/user.entity';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(10); 

    const userRepo = dataSource.getRepository(User);
    await userRepo.save(users);

    console.log('Seeded Users:', users);
  }
}
