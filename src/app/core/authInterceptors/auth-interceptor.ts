import {HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {BehaviorSubject, catchError, filter, switchMap,take,throwError} from 'rxjs';

import { AuthService } from '../httpServices/auth-service';


let isRefreshing = false;

const refreshTokenSubject =
  new BehaviorSubject<string | null>(null);


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isRefreshRequest =
    req.url.includes('/api/auth/refresh-token');

  const isLoginRequest =
    req.url.includes('/api/auth/login');

  const isSignupRequest =
    req.url.includes('/api/auth/signup');

  const isForgotPasswordRequest =
    req.url.includes('/api/auth/forgot-password');

  const isResetPasswordRequest =
    req.url.includes('/api/auth/reset-password');



  const token =
    authService.getToken();



  const shouldAddToken =
    token &&
    !isRefreshRequest &&
    !isLoginRequest &&
    !isSignupRequest &&
    !isForgotPasswordRequest &&
    !isResetPasswordRequest;


  const clonedRequest =
    shouldAddToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;


  return next(clonedRequest).pipe(

    catchError((error: HttpErrorResponse) => {

      if (
        error.status === 401 &&
        isRefreshRequest
      ) {

        isRefreshing = false;

        refreshTokenSubject.next(null);


        /*
         * Clear session
         */

        authService.clearLocalSession();


        /*
         * Go to login
         */

        router.navigate(['/login']);


        return throwError(() => error);
      }


      /*
       * Login/signup/password endpoints
       *
       * Don't refresh token for these.
       */

      if (
        error.status === 401 &&
        (
          isLoginRequest ||
          isSignupRequest ||
          isForgotPasswordRequest ||
          isResetPasswordRequest
        )
      ) {

        return throwError(() => error);
      }


      /*
       * NORMAL PROTECTED API
       *
       * Access token may have expired.
       */

      if (error.status === 401 || error.status===403 ) {


        return handle401Error(
          req,
          next,
          authService
        );
      }


      /*
       * Other errors
       */

      return throwError(() => error);
    })
  );
};


/*
 * Handle 401 from protected API
 */

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
) {


  /*
   * Get refresh token
   */

  const refreshToken =
    authService.getRefreshToken();


  console.log(
    '🔥 REFRESH TOKEN EXISTS:',
    !!refreshToken
  );


  /*
   * No refresh token
   */

  if (!refreshToken) {

    console.log(
      '❌ NO REFRESH TOKEN - LOGGING OUT'
    );


    authService.clearLocalSession();


    authService.navigateToLogin();


    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized'
        })
    );
  }


  /*
   * Start refresh
   */

  if (!isRefreshing) {

    console.log(
      '🔄 STARTING REFRESH REQUEST'
    );


    isRefreshing = true;

    refreshTokenSubject.next(null);


    return authService.refreshAccessToken().pipe(

      /*
       * Refresh successful
       */

      switchMap((response) => {

        console.log(
          '✅ REFRESH SUCCESS'
        );


        isRefreshing = false;


        const newToken =
          response.token;


        /*
         * Send new token to waiting requests
         */

        refreshTokenSubject.next(
          newToken
        );


        /*
         * Retry original request
         */

        const retriedRequest =
          req.clone({
            setHeaders: {
              Authorization:
                `Bearer ${newToken}`
            }
          });


        return next(retriedRequest);
      }),


      /*
       * Refresh failed
       */

      catchError((refreshError) => {

        console.log(
          '❌ REFRESH FAILED - LOGGING OUT'
        );

        console.log(
          'Refresh error status:',
          refreshError.status
        );


        isRefreshing = false;

        refreshTokenSubject.next(null);


        /*
         * Clear local session
         */

        authService.clearLocalSession();


        /*
         * Redirect to login
         */

        authService.navigateToLogin();


        return throwError(
          () => refreshError
        );
      })
    );
  }


  /*
   * Another request is already refreshing.
   *
   * Wait for new access token.
   */

  return refreshTokenSubject.pipe(

    filter(
      (token): token is string =>
        token !== null
    ),

    take(1),

    switchMap((token) => {

      console.log(
        '🔄 RETRYING REQUEST WITH NEW TOKEN'
      );


      const retriedRequest =
        req.clone({
          setHeaders: {
            Authorization:
              `Bearer ${token}`
          }
        });


      return next(retriedRequest);
    })
  );
}