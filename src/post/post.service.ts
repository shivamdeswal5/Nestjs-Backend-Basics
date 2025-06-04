import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { userId, ...postData } = createPostDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const post = this.postRepository.create({
      ...postData,
      user,
    });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, updateData: Partial<CreatePostDto>): Promise<Post> {
    const post = await this.findOne(id);

    if (updateData.userId) {
      const user = await this.userRepository.findOneBy({ id: updateData.userId });
      if (!user) throw new NotFoundException('User not found');
      post.user = user;
    }

    Object.assign(post, updateData);
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}
