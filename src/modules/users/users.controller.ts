import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto';

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.CREATED)
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req: Request) {
    return this.usersService.changePassword(req.user, dto);
  }
}
