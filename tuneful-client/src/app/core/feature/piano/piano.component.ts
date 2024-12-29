import { Component } from '@angular/core';
import { PianoService } from '../helpers/piano.service';
import { pianoKeys } from '../helpers/pianoNotes';
import { PianoNoteComponent } from '../piano-note/piano-note.component';

export interface INote {
  key: number;
  note: string;
}

@Component({
  selector: 'app-piano',
  standalone: true,
  imports: [PianoNoteComponent],
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
})
export class PianoComponent {
  pianoKeys = pianoKeys;

  constructor(private pianoService: PianoService) {}

  onPlayNote(note: string) {
    this.pianoService.playNote(note);
  }

  onReleaseNote(note: string) {
    this.pianoService.releaseNote(note);
  }
}
