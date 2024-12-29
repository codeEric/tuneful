import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IPlaySong {
  path: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaPlayerService {
  private playSongSubject: BehaviorSubject<IPlaySong | null> =
    new BehaviorSubject<IPlaySong | null>(null);
  private playSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public playSong$: Observable<IPlaySong | null> =
    this.playSongSubject.asObservable();
  public play$: Observable<boolean> = this.playSubject.asObservable();
  constructor() {}

  start() {
    this.playSubject.next(true);
  }

  pause() {
    this.playSubject.next(false);
  }

  setSong(title: string) {
    this.playSongSubject.next({
      path: `/assets/${title}.mp3`,
      title,
    });
  }
}
