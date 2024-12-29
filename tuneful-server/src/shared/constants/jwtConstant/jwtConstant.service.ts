import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConstantService {
  constructor(private configService: ConfigService) {}
  getSecret(): string {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }
}
