import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-piano-note',
  standalone: true,
  imports: [NgClass],
  templateUrl: './piano-note.component.html',
  styleUrl: './piano-note.component.scss',
})
export class PianoNoteComponent {
  @Input() note!: string;
  @Input() isPlaying!: boolean;

  @Output() playNote: EventEmitter<string> = new EventEmitter<string>();
  @Output() releaseNote: EventEmitter<string> = new EventEmitter<string>();
  get isSharp() {
    return this.note.includes('#');
  }

  onNoteDown() {
    this.isPlaying = true;
    this.playNote.emit(this.note);
  }

  onNoteUp() {
    this.isPlaying = false;
    this.releaseNote.emit(this.note);
  }
}
