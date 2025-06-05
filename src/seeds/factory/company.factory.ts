
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { User } from '../../user/entities/user.entity';
import {Company} from '../../company/entities/company.entity'

export const CompanyFactory = setSeederFactory(Company, () => {
  const user = new User();
  user.name = faker.person.fullName();
  user.username = faker.internet.username();
  user.email = faker.internet.email();
  user.age = faker.number.int({ min: 18, max: 70 });
  user.password = 'password123'; 
  user.gender = faker.helpers.arrayElement(['m', 'f', 'u']);

  console.log("User Created in Company factory")

  const company = new Company();
    company.ceo = `${faker.person.firstName()} ${faker.person.lastName()}`;
    company.email = faker.internet.email();
    company.name = faker.company.name();
    company.users = [user];
    console.log("Company Seed Data in factory: ",company);
    return company;

});
