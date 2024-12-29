import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConstantService } from 'src/shared/constants/jwtConstant/jwtConstant.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    JwtService,
    Reflector,
    JwtConstantService,
    ConfigService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
