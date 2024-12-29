import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IMelodyDownloadData } from '../../../shared/interfaces/melody.interface';

export type MelodyDocument = HydratedDocument<Melody>;

@Schema({ timestamps: true })
export class Melody {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  bpm: number;

  @Prop({ required: true })
  downloadData: IMelodyDownloadData;

  @Prop({ required: true })
  instrument: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  authorId: { type: Types.ObjectId; ref: 'User' };
}

export const MelodySchema = SchemaFactory.createForClass(Melody);
