import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
 create(@Body() companyDto: CompanyDto) {
  const { userIds = [], ...companyData } = companyDto;  
  return this.companyService.create(companyData, userIds);
}

 @Patch(':id')
 update(@Body() companyDto: CompanyDto,@Param('id', ParseIntPipe) id: number){
  return this.companyService.update(id,companyDto);
 }

 @Patch('/adduser/:id')
 addUserToCompany(@Param('id', ParseIntPipe) id: number,@Body() userData:CreateUserDto){
  return this.companyService.addUserToCompany(id,userData);
 }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Post(':companyId/:userId')
  addExistingUserToCompany(@Param('companyId', ParseIntPipe) companyId: number,@Param('userId', ParseIntPipe) userId: number){
    return this.companyService.addExistingUserToCompany(companyId,userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
