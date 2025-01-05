import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { ConstantsModule } from '../../shared/constants/constants.module';
import { JwtConstantService } from '../../shared/constants/jwtConstant/jwtConstant.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConstantsModule,
    JwtModule.registerAsync({
      imports: [ConstantsModule],
      inject: [JwtConstantService],
      useFactory: async (jwtConstantsService: JwtConstantService) => ({
        secret: jwtConstantsService.getSecret(),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, AuthGuard, Reflector, ConfigService, MailService],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
