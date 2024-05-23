import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.getOne({ where: { id } });
  }
}
