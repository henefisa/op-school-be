import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/constants';
import { UpdateClassDto } from './dto/update-class.dto';
import { GetClassDto } from './dto/get-class.dto';
import { AddMembersDto } from './dto/add-members.dto';
import { RemoveMembersDto } from './dto/remove-members.dto';
import { GetMembersDto } from './dto/get-members.dto';

@Controller({ path: 'classes', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.Admin, Role.Teacher)
  @UseGuards(RoleGuard)
  async createClass(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Patch(':id')
  async updateClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassDto,
  ) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  async deleteClass(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.delete(id);
  }

  @Get()
  async getClasses(@Query() dto: GetClassDto) {
    return this.classesService.getClasses(dto);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.getOne({ where: { id } });
  }

  @Get(':id/members')
  async getMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: GetMembersDto,
  ) {
    return this.classesService.getMembers(id, dto);
  }

  @Post(':id/members')
  async addMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMembersDto,
  ) {
    return this.classesService.addMembers(id, dto);
  }

  @Delete(':id/members')
  async removeMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RemoveMembersDto,
  ) {
    return this.classesService.removeMembers(id, dto);
  }
}
