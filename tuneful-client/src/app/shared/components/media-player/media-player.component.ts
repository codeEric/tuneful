import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FaIconComponent,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { MediaPlayerService } from '../../services/media-player.service';
import { DayjsDateUtils } from '../../utils/dateUtils';

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [SliderModule, FaIconComponent, FormsModule, FormatTimePipe],
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.scss',
})
export class MediaPlayerComponent implements OnInit, AfterViewInit {
  isPlaying: boolean = false;
  volume: number = 100;
  lastVolume: number = 100;
  volumeIcon: IconDefinition = faVolumeHigh;
  progress: number = 0;
  currentTime: number = 0;
  duration: number = 0;

  songPath: string | null = null;
  songTitle: string | null = null;

  @ViewChild('mediaPlayer') playerRef!: ElementRef<HTMLAudioElement>;

  constructor(private mediaPlayerService: MediaPlayerService) {}

  ngOnInit() {
    this.mediaPlayerService.playSong$.subscribe((data) => {
      if (!data) {
        return;
      }
      this.songPath = data.path;
      this.songTitle = data.title;
    });
  }

  ngAfterViewInit() {
    this.mediaPlayerService.play$.subscribe((data) => {
      this.isPlaying = data;
      if (!this.isPlaying) {
        this.playerRef.nativeElement.pause();
      } else {
        void this.playerRef.nativeElement.play();
      }
    });
  }

  onLoadedMetadata() {
    this.duration = this.playerRef.nativeElement.duration;
    this.isPlaying = false;
    this.changePlayerState();
  }

  onAudioTimeUpdate() {
    this.currentTime = this.playerRef.nativeElement.currentTime;
    this.updateProgressBar();
  }

  onAudioEnd() {
    this.isPlaying = false;
  }

  updateProgressBar() {
    this.progress = (this.currentTime / this.duration) * 100;
  }

  changePlayerState() {
    if (this.isPlaying) {
      this.mediaPlayerService.pause();
    } else {
      this.mediaPlayerService.start();
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

  onProgressChange(ev: SliderChangeEvent) {
    if (!ev?.value) {
      return;
    }
    this.progress = (this.duration / 100) * ev.value;
    this.playerRef.nativeElement.currentTime = this.progress;
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

  protected readonly faForwardStep = faForwardStep;
  protected readonly faBackwardStep = faBackwardStep;
  protected readonly faPlay = faPlay;
  protected readonly faPause = faPause;
  protected readonly DayjsDateUtils = DayjsDateUtils;
}
