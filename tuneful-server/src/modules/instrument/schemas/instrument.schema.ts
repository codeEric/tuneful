import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface IInstrumentRange {
  high: string;
  low: string;
}

export type InstrumentDocument = HydratedDocument<Instrument>;

@Schema({ timestamps: true })
export class Instrument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  soundfont: File[];

  @Prop({ required: true })
  common_uses: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Object })
  range: IInstrumentRange;
}

export const InstrumentSchema = SchemaFactory.createForClass(Instrument);
