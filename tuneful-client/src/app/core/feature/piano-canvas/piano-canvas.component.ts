import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Midi } from '@tonejs/midi';
import { Subject, takeUntil } from 'rxjs';
import * as Tone from 'tone';
import { EMode } from '../../layout/edit/edit.component';
import { PianoService } from '../helpers/piano.service';

@Component({
  selector: 'app-piano-canvas',
  standalone: true,
  imports: [],
  templateUrl: './piano-canvas.component.html',
  styleUrl: './piano-canvas.component.scss',
})
export class PianoCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  notes: Record<string, any> = {};
  cellHeight: number = 32;
  cellWidth: number = 64;
  isResizing: boolean = false;
  resizingNote: string | null = null;
  isDragging: boolean = false;
  draggingNote: string | null = null;
  offsetX: number = 0;
  offsetY: number = 0;

  sequence: Tone.Sequence | null = null;
  mode!: EMode;
  destroy$: Subject<void> = new Subject<void>();

  @Output() scrollToMiddle: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private pianoService: PianoService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.pianoService.currentMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.mode = data;
      });

    this.pianoService.playNoteSequence$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.playNoteSequence();
        } else {
          this.pauseNoteSequence();
        }
      });
    if (this.pianoService.melody) {
      this.httpClient
        .get(`/assets/${this.pianoService.melody.title}.mid`, {
          responseType: 'blob',
        })
        .subscribe((data) => {
          console.log(data);
          const reader = new FileReader();
          reader.onload = async (e) => {
            const midiData = e.target?.result as ArrayBuffer;
            const midi = new Midi(midiData);

            this.importMidiNotes(midi);
          };
          reader.readAsArrayBuffer(data);
        });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.setupCanvas();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.setupCanvas();
    this.scrollToMiddleC();
  }

  scrollToMiddleC() {
    const c4Midi = 60;
    const lowestMidi = 21;
    const c4Row = c4Midi - lowestMidi;
    const c4Position = c4Row * this.cellHeight;
    this.scrollToMiddle.emit(c4Position);
  }

  resizeCanvas() {
    this.canvas.nativeElement.width =
      this.canvas.nativeElement.parentElement!.offsetWidth;
    this.canvas.nativeElement.height =
      this.canvas.nativeElement.parentElement!.offsetHeight;
  }

  setupCanvas() {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let y = 0; y <= canvasHeight / this.cellHeight; y++) {
      const midiNote = this.gridYToMidi(y);

      if (this.isWhiteKey(midiNote)) {
        this.ctx.fillStyle = '#25262d';
      } else {
        this.ctx.fillStyle = '#1e1f24';
      }

      this.ctx.fillRect(0, y * this.cellHeight, canvasWidth, this.cellHeight);
    }

    this.ctx.strokeStyle = '#c0c0c0';
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= canvasWidth; x += this.cellWidth) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, canvasHeight);
      this.ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += this.cellHeight) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(canvasWidth, y);
      this.ctx.stroke();
    }
    this.drawNotes();
  }

  isWhiteKey(midiNote: number): boolean {
    const blackKeys = [1, 3, 6, 8, 10];
    const positionInOctave = midiNote % 12;
    return !blackKeys.includes(positionInOctave);
  }

  drawNotes() {
    this.ctx.fillStyle = '#00FF00';

    Object.values(this.notes).forEach((note) => {
      this.ctx.fillRect(
        note.x * this.cellWidth,
        note.y * this.cellHeight,
        note.width * this.cellWidth,
        this.cellHeight
      );
    });
  }

  onCanvasClick(event: MouseEvent) {
    if (this.isDragging || this.isResizing) {
      this.isResizing = false;
      this.isDragging = false;
      this.resizingNote = null;
      this.draggingNote = null;
      this.setCursorStyle(this.mode === EMode.EDIT ? 'default' : 'not-allowed');
      return;
    }
    if (this.mode === EMode.REMOVE) {
      this.deleteNote(event);
    } else if (this.mode === EMode.EDIT) {
      this.placeNote(event);
    }
  }

  deleteNote(event: MouseEvent) {
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.cellWidth);
    const y = Math.floor((event.clientY - rect.top) / this.cellHeight);
    Object.keys(this.notes).forEach((notePosition) => {
      const note = this.notes[notePosition];
      if (
        event.offsetX >= note.x * this.cellWidth &&
        event.offsetX <= (note.x + note.width) * this.cellWidth &&
        event.offsetY >= note.y * this.cellHeight &&
        event.offsetY <= (note.y + note.height) * this.cellHeight
      ) {
        delete this.notes[notePosition];
        this.setupCanvas();
      }
    });
  }

  checkForResize(x: number) {
    const canvasWidth = this.canvas.nativeElement.width;
    const noteEndX = (x + 1) * this.cellWidth;
    if (noteEndX > canvasWidth - this.cellWidth * 4) {
      this.canvas.nativeElement.width = noteEndX + this.cellWidth * 3;
    }
    this.setupCanvas();
  }

  placeNote(event: MouseEvent) {
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.cellWidth);
    const y = Math.floor((event.clientY - rect.top) / this.cellHeight);
    this.checkForResize(x);
    const notePosition = `${x},${y}`;
    this.notes[notePosition] = { x, y, width: 1, height: 1 };
    this.setupCanvas();
    const notePitch = this.getNotePitch(y);
    const noteDuration = 0.5;
    this.pianoService.playAndReleaseNote(notePitch, noteDuration);
  }

  onCanvasMouseDown(event: MouseEvent) {
    if (this.mode === EMode.REMOVE) {
      this.setCursorStyle('not-allowed');
      return;
    }
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.cellWidth);
    const y = Math.floor((event.clientY - rect.top) / this.cellHeight);

    for (let notePosition in this.notes) {
      const note = this.notes[notePosition];

      if (
        x >= note.x &&
        x < note.x + note.width &&
        y >= note.y &&
        y < note.y + note.height
      ) {
        if (
          event.clientX >=
            rect.left + (note.x + note.width) * this.cellWidth - 5 &&
          event.clientX <=
            rect.left + (note.x + note.width) * this.cellWidth + 5
        ) {
          this.isResizing = true;
          this.resizingNote = notePosition;
          this.offsetX =
            event.clientX -
            (rect.left + (note.x + note.width) * this.cellWidth);
          this.setCursorStyle('ew-resize');
        } else {
          this.isDragging = true;
          this.draggingNote = notePosition;
          this.offsetX = event.clientX - rect.left - note.x * this.cellWidth;
          this.offsetY = event.clientY - rect.top - note.y * this.cellHeight;
          this.setCursorStyle('move');
        }
      }
    }
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (this.mode === EMode.REMOVE) {
      this.setCursorStyle('not-allowed');
      return;
    }
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let cursorStyle = 'default';
    if (this.isResizing && this.resizingNote) {
      const note = this.notes[this.resizingNote];

      const newWidth = Math.max(
        1,
        Math.floor(
          (event.clientX - rect.left - note.x * this.cellWidth - this.offsetX) /
            this.cellWidth
        )
      );

      this.notes[this.resizingNote].width = newWidth;

      this.setupCanvas();

      cursorStyle = 'ew-resize';
    }

    if (this.isDragging && this.draggingNote) {
      const newX = Math.floor(
        (event.clientX - rect.left - this.offsetX) / this.cellWidth
      );
      const newY = Math.floor(
        (event.clientY - rect.top - this.offsetY) / this.cellHeight
      );

      this.notes[this.draggingNote].x = newX;
      this.notes[this.draggingNote].y = newY;

      this.setupCanvas();

      cursorStyle = 'move';
    }

    if (!this.isResizing && !this.isDragging) {
      for (let notePosition in this.notes) {
        const note = this.notes[notePosition];
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (
          mouseX >= (note.x + note.width) * this.cellWidth - 5 &&
          mouseX <= (note.x + note.width) * this.cellWidth + 5 &&
          mouseY >= note.y * this.cellHeight &&
          mouseY <= (note.y + note.height) * this.cellHeight
        ) {
          cursorStyle = 'ew-resize';
          break;
        } else if (
          mouseX >= note.x * this.cellWidth &&
          mouseX <= (note.x + note.width) * this.cellWidth &&
          mouseY >= note.y * this.cellHeight &&
          mouseY <= (note.y + note.height) * this.cellHeight
        ) {
          cursorStyle = 'move';
          break;
        }
      }
    }
    this.setCursorStyle(cursorStyle);
  }

  onCanvasMouseUp() {
    // this.isResizing = false;
    // this.isDragging = false;
    // this.resizingNote = null;
    // this.draggingNote = null;
    // this.setCursorStyle('default');
  }

  part: Tone.Part | null = null;

  playNoteSequence() {
    this.stopNoteSequence();
    const secondsPerBeat = 60 / 120;
    const events = Object.keys(this.notes)
      .sort((a, b) => {
        const noteA = this.notes[a];
        const noteB = this.notes[b];
        return noteA.x - noteB.x;
      })
      .map((notePosition) => {
        const note = this.notes[notePosition];
        const notePitch = this.getNotePitch(note.y);
        const noteDuration = this.pianoService.getNoteDuration(note.width);

        return {
          time: note.x * secondsPerBeat,
          note: notePitch,
          duration: noteDuration * (secondsPerBeat * 2),
        };
      });

    this.part = new Tone.Part((time, event) => {
      this.pianoService.playAndReleaseNote(event.note, event.duration, time);
    }, events);
    this.part.start(0);
    this.part.loop = true;
    this.part.loopStart = 0;

    this.part.loopEnd =
      events[events.length - 1].time +
      events[events.length - 1].duration * secondsPerBeat;
    Tone.getTransport().start();
  }

  pauseNoteSequence() {
    Tone.getTransport().pause();
  }

  stopNoteSequence() {
    Tone.getTransport().cancel();
    Tone.getTransport().position = 0;
  }

  getNotePitch(y: number): string {
    const pitches = this.pianoService.getPianoNotes();
    return pitches[y % pitches.length];
  }

  setCursorStyle(style: string) {
    this.canvas.nativeElement.style.cursor = style;
  }

  noteToGridY(midiPitch: number) {
    const lowestMidi = 21;
    return midiPitch - lowestMidi;
  }

  gridYToMidi(gridY: number): number {
    const lowestMidi = 21;
    return gridY + lowestMidi;
  }

  importMidiNotes(midi: Midi) {
    this.notes = {};

    const secondsPerBeat = 60 / 140;

    midi.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        const gridX = Math.round(note.time / secondsPerBeat);
        const gridY = this.noteToGridY(note.midi);
        const width = Math.round(note.duration / secondsPerBeat);
        this.checkForResize(gridX);
        const notePosition = `${gridX},${gridY}`;
        this.notes[notePosition] = {
          x: gridX,
          y: gridY,
          width,
        };
      });
    });

    this.setupCanvas();
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const midiData = e.target?.result as ArrayBuffer;
      const midi = new Midi(midiData);

      this.importMidiNotes(midi);
    };

    reader.readAsArrayBuffer(file);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
