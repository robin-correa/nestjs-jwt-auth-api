import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetRoleDto } from './dto/get-role.dto';
import { Permission } from 'src/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<GetRoleDto> {
    // Check if role with the same name already exists
    const existingRoleByName = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRoleByName) {
      throw new BadRequestException('Role already exist');
    }

    // Fetch permissions from the database based on provided IDs
    let fetchedPermissions: Permission[] = [];
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      fetchedPermissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissionIds),
      });
    }

    // Create a new role entity
    const role = new Role();
    role.name = createRoleDto.name;
    role.permissions = fetchedPermissions; // Assign fetched permissions to the role

    // Save the role entity
    const savedRole = await this.roleRepository.save(role);

    // Return the saved role DTO
    return new GetRoleDto(savedRole);
  }

  async findAll(): Promise<GetRoleDto[]> {
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });

    return roles.map((role) => new GetRoleDto(role));
  }

  async findOne(id: number): Promise<GetRoleDto | undefined> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException();
    }

    return new GetRoleDto(role);
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException();
    }

    const existingRoleByName = await this.roleRepository.findOne({
      where: { name: updateRoleDto.name },
    });

    if (existingRoleByName && existingRoleByName.id != role.id) {
      throw new BadRequestException('Role already exist');
    }

    // Fetch permissions from the database based on provided IDs
    let fetchedPermissions: Permission[] = [];
    if (updateRoleDto.permissionIds && updateRoleDto.permissionIds.length > 0) {
      fetchedPermissions = await this.permissionRepository.findBy({
        id: In(updateRoleDto.permissionIds),
      });
    }

    role.name = updateRoleDto.name;
    role.permissions = fetchedPermissions; // Assign fetched permissions to the role

    // Save the role entity
    const savedRole = await this.roleRepository.save(role);

    // Return the saved role DTO
    return new GetRoleDto(savedRole);
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException();
    }

    await this.roleRepository.delete(role.id);
  }
}
