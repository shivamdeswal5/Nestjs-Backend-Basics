import { DataSource, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

export class CompanyRepository extends Repository<Company> {
  constructor(private dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

}
