import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ILike } from 'typeorm';
import {config} from 'dotenv';
import {sign} from 'jsonwebtoken';

config();

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userByEmail = await this.userRepository.findOne({
      where: {email : createUserDto.email},
    });
    
    const userByUsername = await this.userRepository.findOne({
      where:{username:createUserDto.username},
    })
    if(userByEmail){
      console.log("Email is already registered...")
      throw new Error("User Already Exists .."); 
    }
    if(userByUsername){
      console.log("username is already taken");
      throw new Error("Username already exits");
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  buildUserResponse(user: User) {
    return { user: { ...user, token: this.generateJwtToken(user) } };
  }

  generateJwtToken(user:User){
    console.log("secret: ",process.env.JWT_SECRET);
    return sign(
      {
        id:user.id,
        email: user.email,
        gender: user.gender,
        age:user.age,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    )
    
  }

//   async findAll(): Promise<User[]> {
//     return this.userRepository.find();
//   }

 async findAllWithRelation(){
  return this.userRepository.find({ relations: ['posts','companies'] });
 }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { name: ILike(`%${search}%`) },
          { username: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }


  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
