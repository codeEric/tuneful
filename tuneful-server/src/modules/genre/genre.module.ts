import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConstantService } from 'src/shared/constants/jwtConstant/jwtConstant.service';
import { GenreController } from './controllers/genre.controller';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { GenreService } from './services/genre.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  providers: [
    GenreService,
    JwtService,
    Reflector,
    JwtConstantService,
    ConfigService,
  ],
  controllers: [GenreController],
  exports: [GenreService],
})
export class GenreModule {}
