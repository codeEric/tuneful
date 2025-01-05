import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faDownload,
  faEdit,
  faEllipsis,
  faPause,
  faPlay,
  faPlusSquare,
  faShare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import dayjs, { Dayjs } from 'dayjs';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { filter, Observable, pluck, Subject, takeUntil } from 'rxjs';
import { MelodyService } from '../../../shared/services/melody.service';
import { DayjsDateUtils } from '../../../shared/utils/dateUtils';
import { PianoService } from '../../feature/helpers/piano.service';
import { MediaPlayerService } from './../../../shared/services/media-player.service';
import { ModalService } from './../../services/modal-service.service';

export interface IMelody {
  _id: string;
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
    TieredMenuModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  melodies: IMelody[] = [];

  downloadItems!: MenuItem[];
  currentlyPlaying?: string;
  hoveredRow: number | null = null;
  isPlaying$!: Observable<boolean>;
  shownMelody: IMelody | null = null;

  mobileActionMenuItems: any;
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private modalService: ModalService,
    private melodyService: MelodyService,
    private mediaPlayerService: MediaPlayerService,
    private router: Router,
    private pianoService: PianoService,
    private translocoService: TranslocoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.translocoService.events$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (e) => e.type === 'translationLoadSuccess' || e.type === 'langChanged'
        ),
        pluck('payload')
      )
      .subscribe(() => {
        this.mobileActionMenuItems = [
          {
            label: this.translocoService.translate('download'),
            items: Object.values(EDownloadType).map((value) => ({
              label: value,
              command: (ev: any) => this.downloadFile(ev),
            })),
          },
          {
            label: this.translocoService.translate('delete'),
            command: (ev: any) => this.removeMelody(ev),
          },
        ];
      });
    this.isPlaying$ = this.mediaPlayerService.play$;
    this.downloadItems = Object.values(EDownloadType).map((value) => ({
      label: value,
      command: (ev) => this.downloadFile(ev),
    }));

    this.melodyService.getMelodies().subscribe((data: any) => {
      if (!data) return;
      this.melodies = data.map((melody: any) => {
        return {
          _id: melody._id,
          title: melody.name,
          key: melody.key,
          bpm: melody.bpm,
          genre: melody.genre.name,
          createdAt: dayjs(melody.createdAt).format(
            DayjsDateUtils.SHORT_DATE_FORMAT
          ),
        };
      });
      this.cdr.detectChanges();
    });
  }

  downloadFile(ev: MenuItemCommandEvent) {
    if (!ev.item?.label) {
      return;
    }
    const labelName = ev.item.label;
    switch (labelName) {
      case EDownloadType.MIDI:
        break;
      case EDownloadType.MP3:
        break;
      case EDownloadType.WAV:
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

  showInfo(melody: IMelody) {
    if (this.shownMelody && this.shownMelody._id === melody._id) {
      this.shownMelody = null;
      return;
    }
    this.shownMelody = melody;
  }

  removeMelody(melody: IMelody) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly faPlusSquare = faPlusSquare;
  protected readonly faSearch = faSearch;
  protected readonly faPlay = faPlay;
  protected readonly faTrash = faTrash;
  protected readonly faDownload = faDownload;
  protected readonly faShare = faShare;
  protected readonly faPause = faPause;
  protected readonly faEdit = faEdit;
  protected readonly faEllipsis = faEllipsis;
  protected readonly faChevronDown = faChevronDown;
}
