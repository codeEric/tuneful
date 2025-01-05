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

  @Prop({ required: false, type: Object })
  downloadData: IMelodyDownloadData;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Instrument' })
  instrument: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Genre' })
  genre: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;
}

export const MelodySchema = SchemaFactory.createForClass(Melody);
