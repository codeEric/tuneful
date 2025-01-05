import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConstantService } from 'src/shared/constants/jwtConstant/jwtConstant.service';
import { MelodyController } from './controllers/melody.controller';
import { Melody, MelodySchema } from './schemas/melody.schema';
import { MelodyService } from './services/melody.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Melody.name, schema: MelodySchema }]),
  ],
  providers: [
    MelodyService,
    JwtService,
    Reflector,
    JwtConstantService,
    ConfigService,
  ],
  controllers: [MelodyController],
  exports: [MelodyService],
})
export class MelodyModule {}
