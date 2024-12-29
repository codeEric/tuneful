import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../user/schemas/user.schema';

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
}
