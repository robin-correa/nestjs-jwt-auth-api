import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserDto } from './dto/get-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      relations: ['roles', 'permissions'],
    });

    if (existingUserByEmail) {
      throw new BadRequestException('Email already in used');
    }

    const clearPassword = createUserDto.password;
    createUserDto.password = await this.hashPassword(clearPassword);
    const user = await this.userRepository.save(createUserDto);
    return new GetUserDto(user);
  }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userRepository.find({
      relations: ['roles', 'permissions'],
    });
    return users.map((user) => new GetUserDto(user));
  }

  async findOne(id: number): Promise<GetUserDto | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'permissions'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return new GetUserDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
      relations: ['roles', 'permissions'],
    });

    if (existingUserByEmail && existingUserByEmail.id != user.id) {
      throw new BadRequestException('Email already in used');
    }

    if (updateUserDto.password && updateUserDto.password_confirm) {
      const clearPassword = updateUserDto.password;
      updateUserDto.password = await this.hashPassword(clearPassword);
      delete updateUserDto.password_confirm;
    }

    await this.userRepository.update(id, updateUserDto);
    return new GetUserDto(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: email },
    });

    return userByEmail;
  }

  async findUserById(id: number): Promise<User> {
    const userById = await this.userRepository.findOne({
      where: { id: id },
    });

    return userById;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    this.userRepository.delete(user.id);
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
}
