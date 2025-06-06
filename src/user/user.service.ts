import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ILike } from 'typeorm';
import {config} from 'dotenv';
import {sign} from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-dto';

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
    user.password = ''; 
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
    if (!user) {
      throw new HttpException(`User with id ${id} not found`,400);
    }
    const userByEmail = await this.userRepository.findOne({
      where: {email : updateUserDto.email},
    });
    const userByUsername = await this.userRepository.findOne({
      where:{username:updateUserDto.username},
    })

    if(userByEmail && userByEmail.id !== id){
      console.log("Email is already registered...")
      throw new HttpException("User Already Exists ..",400); 
    }
    if(userByUsername && userByUsername.id !== id){
      console.log("username is already taken");
      throw new HttpException("Username already exits",400);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found',400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', 401);
    }
    return this.buildUserResponse(user);
  }
}
