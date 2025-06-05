import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { UserModule } from '../user/user.module';
import { DataSource } from 'typeorm';
import { CompanyRepository } from './company.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UserModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: CompanyRepository,
      useFactory: (dataSource: DataSource) => new CompanyRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [CompanyRepository],
})
export class CompanyModule {}
