import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  TOKEN_KEY: string = 'tk';
  REFRESH_TOKEN: string = 'rtk';
  LANG_KEY: string = 'translocoLang';
  THEME_KEY: string = 'th';

  constructor() {}

  setRefreshToken(key: string) {
    localStorage.setItem(this.REFRESH_TOKEN, key);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  setToken(key: string) {
    localStorage.setItem(this.TOKEN_KEY, key);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getLanguage() {
    return localStorage.getItem(this.LANG_KEY);
  }

  setTheme(theme: string) {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getTheme() {
    return localStorage.getItem(this.THEME_KEY);
  }
}
