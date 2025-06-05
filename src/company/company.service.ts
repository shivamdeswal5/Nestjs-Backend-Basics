import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CompanyDto } from './dto/company.dto';
import { UserRepository } from '../user/user.repository';
import { CompanyRepository } from './company.repository';

@Injectable()
export class CompanyService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(data: Omit<CompanyDto, 'userIds'>, userIds: number[]) {
    const users = await this.userRepository.findByIds(userIds);

    if (users.length !== userIds.length) {
      throw new BadRequestException('Some user IDs are invalid');
    }

    const company = this.companyRepository.create({
      ...data,
      users,
    });

    return this.companyRepository.save(company);
  }

  findAll() {
    return this.companyRepository.find({ relations: ['users'] });
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  // async update(
  //   id: number,
  //   data: Partial<Omit<CompanyDto, 'userIds'>>,
  //   userIds: number[],
  // ) {
  //   const company = await this.companyRepository.findOne({
  //     where: { id },
  //     relations: ['users'],
  //   });
  //   if (!company) throw new NotFoundException('Company not found');

  //   console.log('Update company found:', company);

  //   let users = company.users;
  //   if (userIds && userIds.length > 0) {
  //     users = await this.userRepository.findByIds(userIds);
  //     console.log('Fetched users for update:', users);
  //     if (users.length !== userIds.length) {
  //       throw new BadRequestException('Some user IDs are invalid');
  //     }
  //     company.users = users;
  //   }

  //   Object.assign(company, data);
  //   console.log('Company entity after assignment:', company);

  //   return this.companyRepository.save(company);
  // }


  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');

    return this.companyRepository.remove(company);
  }
}
