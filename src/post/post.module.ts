import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: PostRepository,
      useFactory: (dataSource) => new PostRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [PostRepository],
})
export class PostModule {}
