import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GenreService } from 'src/modules/genre/services/genre.service';
import { MelodyService } from '../services/melody.service';

@Controller('melody')
export class MelodyController {
  constructor(private readonly melodyService: MelodyService) {}

  @Get('melodies')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  getMelodies() {
    return this.melodyService.getMelodies() ?? [];
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  getMelody(@Param() params: any) {
    return this.melodyService.getMelody(params.id) ?? null;
  }

  @Post('/create')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  saveMelody(@Req() req: any) {
    let body = req.body;
    body.authorId = req.user.id;
    const blob = new Blob([body.downloadData.midi], {
      type: 'application/json',
    });
    body.downloadData.midi = blob;
    return this.melodyService.saveMelody(body);
  }
}
