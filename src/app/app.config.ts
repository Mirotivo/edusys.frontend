import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { httpInterceptorFn } from './interceptors/httpInterceptorFn';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { dateInterceptorFn } from './interceptors/dateInterceptorFn';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone change detection optimizations
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router setup
    provideRouter(routes),

    // HTTP client and interceptors
    provideHttpClient(
      withInterceptors([httpInterceptorFn, dateInterceptorFn])
    ),

    // Toastr configuration
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),

    provideAnimationsAsync(),
  ]
};
