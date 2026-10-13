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


        authService.clearLocalSession();
        router.navigate(['/login']);


        return throwError(() => error);
      }

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

      if (error.status === 401  ) {


        return handle401Error(
          req,
          next,
          authService
        );
      }

      if (error.status === 403) {

  console.error(
    '❌ Access denied (403):',
    req.url
  );

  return throwError(() => error);
}


      return throwError(() => error);
    })
  );
};



function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
) {



  const refreshToken =
    authService.getRefreshToken();


  console.log(
    '🔥 REFRESH TOKEN EXISTS:',
    !!refreshToken
  );



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



  if (!isRefreshing) {

    console.log(
      '🔄 STARTING REFRESH REQUEST'
    );


    isRefreshing = true;

    refreshTokenSubject.next(null);


    return authService.refreshAccessToken().pipe(


      switchMap((response) => {

        console.log(
          '✅ REFRESH SUCCESS'
        );


        isRefreshing = false;


        const newToken =
          response.token;



        refreshTokenSubject.next(
          newToken
        );


        const retriedRequest =
          req.clone({
            setHeaders: {
              Authorization:
                `Bearer ${newToken}`
            }
          });


        return next(retriedRequest);
      }),


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


        authService.clearLocalSession();



        authService.navigateToLogin();


        return throwError(
          () => refreshError
        );
      })
    );
  }


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