import * as lame from '@breezystack/lamejs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { resolve } from 'dns';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { Readable } from 'stream';
import * as synth from 'synth-js';
import * as wavEncoder from 'wav-encoder';
import { Melody, MelodyDocument } from '../schemas/melody.schema';

@Injectable()
export class MelodyService {
  constructor(
    @InjectModel(Melody.name) private melodyModel: Model<MelodyDocument>,
  ) {}

  getMelodies() {
    return this.melodyModel.find().populate('genre');
  }

  getMelody(id: string) {
    return this.melodyModel.find({ _id: id });
  }

  async convertMidiToWav(midiBuffer: any) {
    // console.log(audioData);
    // const data = {
    //   sampleRate: 44100,
    //   channelData: audioData,
    // };
    // console.log(audioData.toArray());
    return synth.midiToWav(midiBuffer).toBuffer();
    // const wavBuffer = await wavEncoder.encode(audioData);
    // return await Buffer.from(wavBuffer);
  }

  async convertWavToMp3(wavBuffer: any) {
    const wav = new DataView(wavBuffer.buffer);

    const channels = wav.getUint16(22, true);
    const sampleRate = wav.getUint32(24, true);

    const audioDataOffset = 44;
    const samples = new Int16Array(wavBuffer.buffer.slice(audioDataOffset));

    const mp3Encoder = new lame.Mp3Encoder(channels, sampleRate, 128);

    const mp3Chunks: Uint8Array[] = [];
    let remainingSamples = samples;

    while (remainingSamples.length > 0) {
      const sampleChunk = remainingSamples.subarray(0, 1152);
      remainingSamples = remainingSamples.subarray(1152);

      const mp3Chunk = mp3Encoder.encodeBuffer(sampleChunk);
      if (mp3Chunk.length > 0) {
        mp3Chunks.push(mp3Chunk);
      }
    }

    const finalMp3Chunk = mp3Encoder.flush();
    if (finalMp3Chunk.length > 0) {
      mp3Chunks.push(finalMp3Chunk);
    }

    return Buffer.concat(mp3Chunks.map((chunk) => Buffer.from(chunk)));
  }

  async saveMelody(newMelody: any) {
    return await this.melodyModel.create(newMelody);
  }
}
