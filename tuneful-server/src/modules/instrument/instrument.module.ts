import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConstantService } from 'src/shared/constants/jwtConstant/jwtConstant.service';
import { InstrumentController } from './controllers/instrument.controller';
import { Instrument, InstrumentSchema } from './schemas/instrument.schema';
import { InstrumentService } from './services/instrument.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instrument.name, schema: InstrumentSchema },
    ]),
  ],
  providers: [
    InstrumentService,
    JwtService,
    Reflector,
    JwtConstantService,
    ConfigService,
  ],
  controllers: [InstrumentController],
  exports: [InstrumentService],
})
export class InstrumentModule {}
