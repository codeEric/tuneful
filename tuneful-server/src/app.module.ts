import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { GenreModule } from './modules/genre/genre.module';
import { InstrumentModule } from './modules/instrument/instrument.module';
import { MelodyModule } from './modules/melody/melody.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    GenreModule,
    InstrumentModule,
    MelodyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
