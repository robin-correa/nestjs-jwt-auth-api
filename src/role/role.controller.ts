import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRoleDto } from './dto/get-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<GetRoleDto> {
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<GetRoleDto[]> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GetRoleDto> {
    return await this.roleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<GetRoleDto> {
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.roleService.remove(id);
  }
}
