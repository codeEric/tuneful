import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConstantService } from 'src/shared/constants/jwtConstant/jwtConstant.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controllers/user.controller';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { User, UserSchema } from './schemas/user.schema';
import { ResetTokenService } from './services/reset-token/reset-token.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    ResetTokenService,
    JwtService,
    Reflector,
    JwtConstantService,
    ConfigService,
  ],
  controllers: [UserController],
  exports: [
    UserService,
    ResetTokenService,
    MongooseModule.forFeature([
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
  ],
})
export class UserModule {}
