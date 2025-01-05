import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { INoteSequence } from '@magenta/music';
import { MusicRNN } from '@magenta/music/es6';
import { Note } from '@tonejs/midi/dist/Note';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { first } from 'rxjs';
import * as Tone from 'tone';
import { PianoService } from '../../../core/feature/helpers/piano.service';
import { ModalService } from '../../../core/services/modal-service.service';
import { GenreService } from '../../services/genre.service';
import { MelodyService } from '../../services/melody.service';
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
  genres: string[] = [];
  genresResponse: any[] = [];
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

  pitches: any[] = [
    {
      key: 'C',
      pitch: 60,
    },
    {
      key: 'C#',
      pitch: 61,
    },
    {
      key: 'D',
      pitch: 62,
    },
    {
      key: 'D#',
      pitch: 63,
    },
    {
      key: 'E',
      pitch: 64,
    },
    {
      key: 'F',
      pitch: 65,
    },
    {
      key: 'F#',
      pitch: 66,
    },
    {
      key: 'G',
      pitch: 67,
    },
    {
      key: 'G#',
      pitch: 68,
    },
    {
      key: 'A',
      pitch: 69,
    },
    {
      key: 'A#',
      pitch: 70,
    },
    {
      key: 'B',
      pitch: 71,
    },
  ];

  newMelodyForm!: FormGroup;
  popModel!: MusicRNN;
  jazzModel!: MusicRNN;
  model!: MusicRNN;

  key: INoteSequence = {
    notes: [{ pitch: 60, startTime: 0, endTime: 1 }],
    quantizationInfo: { stepsPerQuarter: 1, stepsPerSecond: 1 },
    totalQuantizedSteps: 2,
  };

  steps: number = 100;
  temperature: number = 1;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private pianoService: PianoService,
    private genreService: GenreService,
    private melodyService: MelodyService,
    private cdr: ChangeDetectorRef
  ) {
    this.modalService.showNewMelodyModal$.subscribe((state: boolean) => {
      this.isVisible = state;
    });
  }
  ngOnInit() {
    this.popModel = new MusicRNN('../../assets/models/Pop');
    this.jazzModel = new MusicRNN('../../assets/models/Jazz');
    this.model = new MusicRNN(
      'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn'
    );
    this.popModel
      .initialize()
      .then()
      .catch((_: Error) => {
        console.error('Failed to initialize Pop Model');
      });
    this.jazzModel
      .initialize()
      .then()
      .catch((_: Error) => {
        console.error('Failed to initialize Jazz Model');
      });
    this.initForm();

    this.genreService
      .getGenres()
      .pipe(first())
      .subscribe((data: any) => {
        if (!data) return;
        this.genresResponse = data;
        this.genres = data.map((g: any) => g.name);
        this.cdr.detectChanges();
      });
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
      this.key.notes![0].pitch = this.pitches.find(
        (item) => item.key === this.newMelodyForm.controls['key'].value
      ).pitch;
      let result;
      switch (this.newMelodyForm.controls['genre'].value) {
        case 'Pop':
          console.log(this.key);
          result = await this.popModel.continueSequence(
            this.key,
            this.steps,
            this.temperature
          );
          break;
        case 'Jazz':
          result = await this.model.continueSequence(
            this.key,
            this.steps,
            this.temperature
          );
          break;
      }
      const noteSequenceJson = JSON.stringify(result);

      const melodyData = {
        name: this.newMelodyForm.controls['title'].value,
        key: this.newMelodyForm.controls['key'].value,
        bpm: this.newMelodyForm.controls['bpm'].value,
        downloadData: {
          midi: noteSequenceJson,
        },
        genre: this.genresResponse.find(
          (genre) => genre.name === this.newMelodyForm.controls['genre'].value
        )._id,
      };
      this.melodyService.saveMelody(melodyData).pipe(first()).subscribe();
    } catch (error) {
      console.error('Error has occured: ' + error);
    }
  }

  closeModal() {
    this.modalService.closeNewMelodyModal();
  }
}
