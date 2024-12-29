import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/auth/interceptors/jwt.interceptor';
import { TranslocoHttpLoader } from './core/services/transloco-loader';
import { StorageService } from './shared/services/storage.service';

const DEFAULT_LANGAGE = 'en';

export function preloadTranslation(
  transloco: TranslocoService,
  storageService: StorageService
) {
  return function () {
    transloco.setActiveLang(storageService.getLanguage() ?? DEFAULT_LANGAGE);
    return firstValueFrom(transloco.load(DEFAULT_LANGAGE));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['en', 'lt'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [TranslocoService, StorageService],
      useFactory: preloadTranslation,
    },
    provideAnimationsAsync(),
    provideTranslocoPersistLang({
      storage: {
        useValue: localStorage,
      },
    }),
  ],
};
