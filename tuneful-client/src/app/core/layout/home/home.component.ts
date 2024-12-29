import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faDownload,
  faEdit,
  faPause,
  faPlay,
  faPlusSquare,
  faShare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { TranslocoPipe } from '@jsverse/transloco';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { PianoService } from '../../feature/helpers/piano.service';
import { MediaPlayerService } from './../../../shared/services/media-player.service';
import { ModalService } from './../../services/modal-service.service';

export interface IMelody {
  title: string;
  key: string;
  bpm: number;
  genre: string;
  createdAt: string;
}

export enum EDownloadType {
  MP3 = 'MP3',
  MIDI = 'MIDI',
  WAV = 'WAV',
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent,
    FloatLabelModule,
    InputTextModule,
    InputGroupModule,
    ButtonDirective,
    TableModule,
    TranslocoPipe,
    MenuModule,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  melodies: IMelody[] = [
    {
      title: 'Džiazo melodija',
      key: 'C#',
      bpm: 125,
      genre: 'Jazz',
      createdAt: '2024-11-02',
    },
    {
      title: 'Melodija',
      key: 'D',
      bpm: 104,
      genre: 'Pop',
      createdAt: '2024-11-02',
    },
  ];

  downloadItems!: MenuItem[];
  currentlyPlaying?: string;
  hoveredRow: number | null = null;
  isPlaying$!: Observable<boolean>;

  constructor(
    private modalService: ModalService,
    private mediaPlayerService: MediaPlayerService,
    private router: Router,
    private pianoService: PianoService
  ) {}

  ngOnInit(): void {
    this.isPlaying$ = this.mediaPlayerService.play$;
    this.downloadItems = Object.values(EDownloadType).map((value) => ({
      label: value,
      command: (ev) => this.downloadFile(ev),
    }));
  }

  downloadFile(ev: MenuItemCommandEvent) {
    if (!ev.item?.label) {
      return;
    }
    const labelName = ev.item.label;
    switch (labelName) {
      case EDownloadType.MIDI:
        console.log(labelName);
        break;
      case EDownloadType.MP3:
        console.log(labelName);
        break;
      case EDownloadType.WAV:
        console.log(labelName);
        break;
    }
  }

  openModal() {
    this.modalService.openNewMelodyModal();
  }

  onStartMelody(title: string) {
    if (this.currentlyPlaying === title) {
      this.mediaPlayerService.start();
      return;
    }
    this.mediaPlayerService.setSong(title);
    this.mediaPlayerService.start();
    this.currentlyPlaying = title;
  }

  onPauseMelody() {
    this.mediaPlayerService.pause();
  }

  editMelody(melody: IMelody) {
    this.pianoService.melody = melody;
    void this.router.navigate(['/edit']);
  }

  protected readonly faPlusSquare = faPlusSquare;
  protected readonly faSearch = faSearch;
  protected readonly faPlay = faPlay;
  protected readonly faTrash = faTrash;
  protected readonly faDownload = faDownload;
  protected readonly faShare = faShare;
  protected readonly faPause = faPause;
  protected readonly faEdit = faEdit;
}
