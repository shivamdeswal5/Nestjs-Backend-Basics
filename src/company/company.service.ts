import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CompanyDto } from './dto/company.dto';
import { UserRepository } from '../user/user.repository';
import { CompanyRepository } from './company.repository';
import { DataSource, In, QueryRunner } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
    private dataSource: DataSource,
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

  async update(id: number, data: CompanyDto) {
    const { userIds, ...restData } = data;
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['users']
    })
    console.log("Company to be updated is: ", company);
    console.log("Data sent: ", restData);

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    console.log("Updated Users Id: ", userIds);
    let users = userIds && userIds.length > 0
    ? await this.userRepository.find({ where: { id: In(userIds) } })
    : [];
    console.log("Updated users to be added in company: ", users);
    company.users = users;

    Object.assign(company,restData);

    console.log("Company data after Updation: ",company);
    return this.companyRepository.save(company);

  }

  async addUserToCompany(id:number,userData:CreateUserDto){

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const user = this.userRepository.create(userData);
      await queryRunner.manager.save(user); 
      
      const company = await queryRunner.manager.findOne(Company,{
        where:{id:id},
        relations: ['users'],
      })

      if(!company) throw new NotFoundException(`Company with id ${id} not found`);

      company.users.push(user);
      await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();
      // console.log("Returning Company: ",company);
      return company;
    }catch(e){
      await queryRunner.commitTransaction();
      throw e;
    }finally{
      await queryRunner.release();      
    }
  }

  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');

    return this.companyRepository.remove(company);
  }
}
