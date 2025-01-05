import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instrument, InstrumentDocument } from '../schemas/instrument.schema';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectModel(Instrument.name)
    private instrumentModel: Model<InstrumentDocument>,
  ) {}

  getInstruments() {
    return this.instrumentModel.find();
  }
}
