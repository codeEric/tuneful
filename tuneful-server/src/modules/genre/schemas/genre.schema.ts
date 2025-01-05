import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({ timestamps: true })
export class Genre {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bpm: number;

  @Prop({ required: true })
  rhytmic_pattern: string;

  @Prop({ required: true })
  mood: string[];

  @Prop({ required: true })
  dynamics: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
