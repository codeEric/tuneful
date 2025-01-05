import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt } from 'crypto';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { MailService } from 'src/common/mail/mail.service';
import {
  ResetToken,
  ResetTokenDocument,
} from 'src/modules/user/schemas/reset-token.schema';
import { ResetTokenService } from 'src/modules/user/services/reset-token/reset-token.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => ResetTokenService))
    private resetTokenService: ResetTokenService,
    private jwtService: JwtService,
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetTokenDocument>,
    private mailService: MailService,
  ) {}

  async getHashedPassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString('hex');

      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (!user) throw new NotFoundException('Email Does not exist');
    const isMatched = await this.verify(pass, user.password);
    if (!isMatched) throw new UnauthorizedException('Invalid Password');
    const payload = { id: user.id, email: user.email, name: user.name };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15min',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const newAccessToken = await this.jwtService.signAsync(
        { id: payload.id, email: payload.email, name: payload.name },
        { expiresIn: '15min' },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async signAsync(payload: any): Promise<any> {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verify(password, hash): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'));
      });
    });
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUser({ email: email });

    if (user) {
      const resetToken = nanoid(64);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      await this.resetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate: expiryDate,
      });
      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return {
      message: `Email Sent`,
    };
  }

  async verifyPasswordResetToken(token: string) {
    const dbToken = await this.resetTokenService.findOne({ token: token });
    if (dbToken) {
      const now = new Date();
      if (now > dbToken.expiryDate) {
        return {
          message: 'Error',
        };
      }
      return {
        message: 'Success',
      };
    }
    return {
      message: 'Error',
    };
  }
}
