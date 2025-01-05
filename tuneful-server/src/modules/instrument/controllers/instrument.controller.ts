import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { InstrumentService } from '../services/instrument.service';

@Controller('instrument')
export class InstrumentController {
  constructor(private instrumentService: InstrumentService) {}

  @Get('instruments')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  getGenres() {
    return this.instrumentService.getInstruments() ?? [];
  }
}
