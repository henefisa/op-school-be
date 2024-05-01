import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from 'src/shared/guards/jwt-refresh-auth.guard';
import { Request } from 'express';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async getStatus() {
    return;
  }

  @Get('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  async refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.CREATED)
  async fotgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  // @Get('reset-password')
  // async resetPassword(@Query('token') token: string) {
  //   return this.authService.resetPassword(token);
  // }
}
