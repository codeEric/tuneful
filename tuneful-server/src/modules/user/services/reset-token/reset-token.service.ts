import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ResetToken,
  ResetTokenDocument,
} from '../../schemas/reset-token.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserService } from '../user.service';

@Injectable()
export class ResetTokenService {
  constructor(
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetTokenDocument>,
  ) {}

  async findOne(query: any) {
    return this.resetTokenModel.findOne(query);
  }
}
