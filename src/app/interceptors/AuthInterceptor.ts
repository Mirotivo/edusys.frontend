import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private ngZone: NgZone, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted request:', req);

    // Add the Authorization header if the token exists
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Intercept the response and map to `response.data` if applicable
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body && event.body.data !== undefined) {
          console.log('Intercepted response body:', event.body);
          // Map the response body to `response.data`
          return event.clone({ body: event.body.data });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        // Handle 401 Unauthorized
        if (error.status === 401) {
          console.log('Redirecting to login due to 401 Unauthorized');
          this.ngZone.run(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          });
        }

        // Re-throw the error for further handling if needed
        return throwError(() => error);
      })
    );
  }
}
