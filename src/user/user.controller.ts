import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { Permissions } from 'src/auth/permissions.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions('CreateUser')
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Permissions('ViewUsers')
  async findAll(): Promise<GetUserDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @Permissions('ViewUser')
  async findOne(@Param('id') id: number): Promise<GetUserDto> {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @Permissions('UpdateUser')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('DeleteUser')
  async remove(@Param('id') id: number) {
    return await this.userService.remove(id);
  }
}
