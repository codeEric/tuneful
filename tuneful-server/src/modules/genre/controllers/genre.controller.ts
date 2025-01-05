import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GenreService } from '../services/genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('genres')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  getGenres() {
    return this.genreService.getGenres() ?? [];
  }
}
