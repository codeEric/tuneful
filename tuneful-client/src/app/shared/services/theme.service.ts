import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export enum ETheme {
  DARK = 'dark',
  LIGHT = 'light',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeSubject: BehaviorSubject<ETheme> =
    new BehaviorSubject<ETheme>(ETheme.DARK);
  public currentTheme$: Observable<ETheme> =
    this.currentThemeSubject.asObservable();

  constructor(private storageService: StorageService) {}

  loadTheme() {
    this.currentThemeSubject.next(
      (this.storageService.getTheme() as ETheme) ?? ETheme.DARK
    );
  }

  updateTheme(theme: ETheme) {
    this.currentThemeSubject.next(theme);
    this.storageService.setTheme(theme);
  }
}
