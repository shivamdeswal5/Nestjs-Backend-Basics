import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { User } from '../../user/entities/user.entity';

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();
  user.name = faker.person.fullName();
  user.username = faker.internet.username();
  user.email = faker.internet.email();
  user.age = faker.number.int({ min: 18, max: 70 });
  user.password = 'password123'; 
  user.gender = faker.helpers.arrayElement(['m', 'f', 'u']);

  return user;
});