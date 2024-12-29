import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as Tone from 'tone';
import { EMode } from '../../layout/edit/edit.component';
import { IMelody } from '../../layout/home/home.component';
import { pianoKeys } from './pianoNotes';

export enum EInstrument {
  PIANO,
}

@Injectable({
  providedIn: 'root',
})
export class PianoService {
  private pianoPlayer!: Tone.Sampler;
  private pianoKeys = pianoKeys.reverse();

  private bpm: number = 60;
  private instrument: EInstrument = EInstrument.PIANO;
  private mode: EMode = EMode.EDIT;

  private currentModeSubject: BehaviorSubject<EMode> =
    new BehaviorSubject<EMode>(this.mode);
  private currentBPMSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(this.bpm);
  private currentInstrumentSubject: BehaviorSubject<EInstrument> =
    new BehaviorSubject<EInstrument>(this.instrument);
  private playNoteSequenceSubject: Subject<boolean> = new Subject<boolean>();

  public currentMode$: Observable<EMode> =
    this.currentModeSubject.asObservable();
  public currentBPM$: Observable<number> =
    this.currentBPMSubject.asObservable();
  public currentInstrument$: Observable<EInstrument> =
    this.currentInstrumentSubject.asObservable();
  public playNoteSequence$: Observable<boolean> =
    this.playNoteSequenceSubject.asObservable();

  public melody: IMelody | null = null;

  constructor() {
    this.pianoPlayer = new Tone.Sampler({
      A0: '../../../../assets/notes/A0v8.flac',
      A2: '../../../../assets/notes/A2v8.flac',
      A4: '../../../../assets/notes/A4v8.flac',
      A6: '../../../../assets/notes/A6v8.flac',
      C1: '../../../../assets/notes/C1v8.flac',
      C4: '../../../../assets/notes/C4v8.flac',
      C5: '../../../../assets/notes/C5v8.flac',
      C7: '../../../../assets/notes/C7v8.flac',
    }).toDestination();

    Tone.loaded().then(() => {
      console.log('Loaded');
    });
  }

  setBPM(newBPM: number) {
    this.currentBPMSubject.next(newBPM);
  }

  setInstrument(newInstrument: EInstrument) {
    this.currentInstrumentSubject.next(newInstrument);
  }

  setMode(newMode: EMode) {
    this.currentModeSubject.next(newMode);
  }

  setPianoSequence(newValue: boolean) {
    this.playNoteSequenceSubject.next(newValue);
  }

  playNote(note: string) {
    this.pianoPlayer.triggerAttack(note);
  }

  releaseNote(note: string) {
    this.pianoPlayer.triggerRelease(note);
  }

  playAndReleaseNote(
    note: string | number,
    duration: number,
    startTime?: number
  ) {
    this.pianoPlayer.triggerAttackRelease(note, duration, startTime);
  }

  getNoteDuration(noteWidth: number) {
    const beatsPerMinute = 120;
    const beatDurationInSeconds = 60 / beatsPerMinute;
    const noteDurationInBeats = noteWidth;
    return beatDurationInSeconds * noteDurationInBeats;
  }

  getPianoKeys() {
    return this.pianoKeys;
  }

  getPianoNotes() {
    return this.pianoKeys.map((key) => key.note);
  }
}
