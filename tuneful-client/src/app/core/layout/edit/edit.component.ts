import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faBan,
  faPause,
  faPen,
  faPlay,
  faStop,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';
import { PianoService } from '../../feature/helpers/piano.service';
import { PianoCanvasComponent } from '../../feature/piano-canvas/piano-canvas.component';
import { PianoComponent } from '../../feature/piano/piano.component';

export interface IDropdownOption {
  name: string;
}

export enum EMode {
  EDIT = 'Edit',
  REMOVE = 'Remove',
}

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ButtonModule,
    FaIconComponent,
    InputNumberModule,
    FormsModule,
    TranslocoPipe,
    DropdownModule,
    SliderModule,
    NgClass,
    PianoComponent,
    PianoCanvasComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  bpm: number = 130;
  minBPM: number = 30;
  maxBPM: number = 250;
  volume: number = 100;
  lastVolume: number = 100;
  volumeIcon: IconDefinition = faVolumeHigh;
  selectedMode: EMode = EMode.EDIT;
  isPlaying: boolean = false;

  instruments: IDropdownOption[] = [
    {
      name: 'Piano',
    },
    {
      name: 'Guitar',
    },
  ];

  selectedInstrument: IDropdownOption = this.instruments[0];

  @ViewChild('pianoContainer')
  pianoContainerDiv!: ElementRef<HTMLDivElement>;

  constructor(private pianoService: PianoService) {}

  onSelectTool(newMode: EMode) {
    this.selectedMode = newMode;
    this.pianoService.setMode(newMode);
  }

  onBPMBlur(ev: any) {
    if (this.bpm >= this.maxBPM) {
      this.bpm = this.maxBPM;
    } else if (this.bpm <= this.minBPM) {
      this.bpm = this.minBPM;
    }
  }

  updateVolumeIcon() {
    if (this.volume === 0) {
      this.volumeIcon = faVolumeXmark;
    } else if (this.volume < 50) {
      this.volumeIcon = faVolumeLow;
    } else {
      this.volumeIcon = faVolumeHigh;
    }
  }

  onVolumeChange(ev: SliderChangeEvent) {
    this.volume = ev?.value || 0;
    this.updateVolumeIcon();
  }

  muteVolume() {
    if (this.volume > 0) {
      this.lastVolume = this.volume;
      this.volume = 0;
    } else {
      this.volume = this.lastVolume;
    }
    this.updateVolumeIcon();
  }

  onPlay() {
    this.isPlaying = true;
    this.pianoService.setPianoSequence(this.isPlaying);
  }

  onPause() {
    this.isPlaying = false;
    this.pianoService.setPianoSequence(this.isPlaying);
  }

  onScrollToMiddle(c4Position: number) {
    if (!this.pianoContainerDiv) {
      return;
    }
    this.pianoContainerDiv.nativeElement.scrollTop = c4Position;
  }

  protected readonly faPlay = faPlay;
  protected readonly faPause = faPause;
  protected readonly faStop = faStop;
  protected readonly faBan = faBan;
  protected readonly faPen = faPen;
  protected readonly ETool = EMode;
}
