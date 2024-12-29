import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { INoteSequence } from '@magenta/music';
import { MusicRNN, MusicVAE, Player } from '@magenta/music/es6';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import * as Tone from 'tone';
import { PianoService } from '../../../core/feature/helpers/piano.service';
import { ModalService } from '../../../core/services/modal-service.service';
import { FloatLabelInputComponent } from '../float-label-input/float-label-input.component';

@Component({
  selector: 'app-new-melody-modal',
  standalone: true,
  imports: [
    DialogModule,
    TranslocoPipe,
    InputTextModule,
    FloatLabelInputComponent,
    ReactiveFormsModule,
    DropdownModule,
    ButtonDirective,
  ],
  templateUrl: './new-melody-modal.component.html',
  styleUrl: './new-melody-modal.component.scss',
})
export class NewMelodyModalComponent implements OnInit {
  isVisible: boolean = false;
  genres: string[] = ['Lo-fi', 'Pop', 'Hip-hop'];
  keys: string[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];

  newMelodyForm!: FormGroup;
  model!: MusicRNN;

  key: INoteSequence = {
    notes: [{ pitch: 60, startTime: 0, endTime: 1 }],
    quantizationInfo: { stepsPerQuarter: 1, stepsPerSecond: 1 },
    totalQuantizedSteps: 2,
  };

  steps: number = 40;
  temperature: number = 0.8;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private pianoService: PianoService
  ) {
    this.modalService.showNewMelodyModal$.subscribe((state: boolean) => {
      this.isVisible = state;
    });
  }
  ngOnInit() {
    this.model = new MusicRNN(
      'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn'
    );
    this.model
      .initialize()
      .then()
      .catch((error: Error) => {
        console.error('Failed to initialize MusicRNN');
      });
    this.initForm();
  }

  initForm() {
    this.newMelodyForm = this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(3),
          Validators.max(50),
        ]),
      ],
      bpm: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(1),
          Validators.maxLength(3),
        ]),
      ],
      genre: ['', Validators.compose([Validators.required])],
      key: ['', Validators.compose([Validators.required])],
    });
  }

  async generate() {
    try {
      console.log(this.key);
      const result = await this.model.continueSequence(
        this.key,
        this.steps,
        this.temperature
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  closeModal() {
    this.modalService.closeNewMelodyModal();
  }
}
