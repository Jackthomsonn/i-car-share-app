import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorProvider } from 'src/app/providers/error/error.provider';
import { AuthenticationProvider } from '../../providers/authentication/authentication.provider';
import { LoadingProvider } from './../../providers/loading/loading.provider';
import { StorageKeys } from 'src/app/enums/storage.enum';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authenticationProvider: AuthenticationProvider,
    private router: Router,
    private errorProvider: ErrorProvider,
    private loadingProvider: LoadingProvider,
    private storage: Storage) { }

  private isAuthError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  private isForbiddenError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === 403;
  }

  private isNotFoundError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === 404;
  }

  private isBadRequestError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === 400;
  }

  private isTooLargeError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === 413;
  }

  private async handleToken(request: HttpRequest<any>, next: HttpHandler) {
    if (!request.url.includes('update-password')) {
      request = request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${await this.authenticationProvider.getToken()}`
        })
      });
    }

    return next.handle(request).pipe(catchError(async (error) => {
      if (this.isAuthError(error)) {
        const token = await this.authenticationProvider.getToken();

        return this.authenticationProvider.getRefreshToken(token).pipe(switchMap(async (response: { accessToken: string }) => {
          await this.storage.set('hitch-hike-share', response.accessToken);
          request = request.clone({
            headers: new HttpHeaders({
              Authorization: `Bearer ${await this.authenticationProvider.getToken()}`
            })
          });

          return next.handle(request).toPromise();
        })).toPromise();
      }

      if (this.isForbiddenError(error)) {
        this.router.navigate(['login']);
        this.loadingProvider.isLoading.next(false);
        this.storage.remove(StorageKeys.ACCESS_TOKEN);
      }

      if (this.isNotFoundError(error) || this.isBadRequestError(error) || this.isTooLargeError(error)) {
        this.errorProvider.exceptionCaught.next(error);
        this.loadingProvider.isLoading.next(false);
      }

      return next.handle(request).toPromise();
    })).toPromise();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleToken(request, next));
  }
}