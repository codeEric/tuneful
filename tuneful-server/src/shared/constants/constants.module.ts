import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtConstantService } from './jwtConstant/jwtConstant.service';

@Module({
  imports: [ConfigModule],
  providers: [JwtConstantService],
  exports: [JwtConstantService],
})
export class ConstantsModule {}
