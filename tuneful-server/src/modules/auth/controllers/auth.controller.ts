import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { error } from 'console';
import { User } from '../../user/schemas/user.schema';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  log() {
    return 'Hello';
  }

  @Post('login')
  login(@Body() loginSchema: User) {
    return this.authService.validateUser(
      loginSchema.email,
      loginSchema.password,
    );
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body() email: any) {
    return this.authService.forgotPassword(email.email);
  }

  @Post('verify-password-token')
  async verifyPasswordToken(@Body() token: any) {
    const message = await this.authService.verifyPasswordResetToken(
      token.token,
    );
    if (message.message === 'Error') {
      throw new BadRequestException(error);
    } else {
      return HttpStatus.OK;
    }
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
