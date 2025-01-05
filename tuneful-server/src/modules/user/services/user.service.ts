import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../../auth/services/auth.service';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  logger: Logger;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async findUser(query: any) {
    return this.userModel.findOne(query);
  }

  async findOne(query: any): Promise<any> {
    return this.userModel.findOne(query).select('+password');
  }

  async create(user: any): Promise<any> {
    this.logger.log('Creating controllers.');

    user.password = await this.authService.getHashedPassword(user.password);
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(query: any, payload: any): Promise<User> {
    this.logger.log('Updating User.');
    const result = await this.userModel.findOneAndUpdate(query, payload, {
      new: true,
      upsert: false,
    });
    if (!result) {
      this.logger.warn('No document matched the query. Update failed.');
    }
    return result;
  }

  async findOneAndRemove(query: any): Promise<any> {
    return this.userModel.findOneAndDelete(query);
  }

  async update(user: User) {
    return this.userModel.updateOne(user);
  }
}
