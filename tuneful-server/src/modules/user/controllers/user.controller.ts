import {
  Body,
  ConflictException,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { AuthenticatedUser } from 'src/shared/decorators/user.decorator';
import { User } from '../schemas/user.schema';
import { ResetTokenService } from '../services/reset-token/reset-token.service';
import { UserService } from '../services/user.service';
import { UserModule } from './../user.module';

export interface IUser {
  name: string;
  email: string;
}

@Controller('user')
export class UserController {
  logger: Logger;
  constructor(
    private readonly userService: UserService,
    private resetTokenService: ResetTokenService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {
    this.logger = new Logger(UserController.name);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() newUser: User): Promise<any> {
    try {
      const query = { email: newUser.email };
      const isUser = await this.userService.findOne(query);
      if (isUser) throw new ConflictException('User Already Exist');

      return await this.userService.create(newUser);
    } catch (err) {
      this.logger.error('Something went wrong in signup:', err);
      throw err;
    }
  }

  @Get('name')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  getAuthenticatedName(@AuthenticatedUser('name') name: string): string {
    return name;
  }

  @Get('authenticated-user')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  getAuthenticatedUser(
    @AuthenticatedUser('name') name: string,
    @AuthenticatedUser('email') email: string,
  ): IUser {
    return {
      name,
      email,
    };
  }

  @Put('update-name')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async updateName(@Req() req, @Body('name') newName: string) {
    const userId = req.user.id;

    const updatedUser = await this.userService.findOneAndUpdate(
      { _id: userId },
      { name: newName },
    );

    const payload = {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
    };
    return await this.authService.signAsync(payload);
  }

  @Put('update-email')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  updateEmail(@Req() req, @Body('email') newEmail: string) {
    const userId = req.user.id;
    return this.userService.findOneAndUpdate(
      { _id: userId },
      { email: newEmail },
    );
  }

  @Put('update-password')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  updatePassword(@Req() req, @Body('password') newPassword: string) {
    const userId = req.user.id;
    return this.userService.findOneAndUpdate(
      { _id: userId },
      { password: newPassword },
    );
  }

  @Put('change-password')
  @HttpCode(200)
  async changePassword(@Body() body: { password: string; token: string }) {
    const dbToken = await this.resetTokenService.findOne({ token: body.token });
    if (dbToken) {
      const user = await this.userService.findUser({ _id: dbToken.userId });
      if (user) {
        const pass = await this.authService.getHashedPassword(body.password);
        return await this.userService.findOneAndUpdate(
          { _id: user._id },
          { password: pass },
        );
      }
    }
  }
}
