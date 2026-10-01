import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, SignupRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenResponse } from '../../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../../../environments/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: SignupRequest) {
    return this.http.post(this.baseUrl + ENDPOINTS.auth.signup, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + ENDPOINTS.auth.login, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);   
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username);
      })
    );
  }

 
  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<RefreshTokenResponse>(this.baseUrl + ENDPOINTS.auth.refreshToken, { refreshToken }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put(this.baseUrl + ENDPOINTS.auth.changePassword, data, { responseType: 'text' });
  }

  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(this.baseUrl + ENDPOINTS.auth.forgotPassword, data, { responseType: 'text' });
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(this.baseUrl + ENDPOINTS.auth.resetPassword, data, { responseType: 'text' });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {   
    return localStorage.getItem('refreshToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

isLoggedIn(): boolean {
  const token = this.getToken();

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    return true;

  } catch {
    return false;
  }
}


logout(): void {

  const refreshToken = this.getRefreshToken();

  /*
   * Backend ko logout request bhejo
   */
  if (refreshToken) {

    this.http.post(
      this.baseUrl + ENDPOINTS.auth.logout,
      { refreshToken }
    ).subscribe({
      next: () => {
        console.log('Logged out from backend');
      },
      error: (error) => {
        console.log('Backend logout failed', error);
      }
    });
  }


  /*
   * Frontend session clear
   */
  this.clearLocalSession();


  /*
   * Login page
   */
  this.navigateToLogin();
}


clearLocalSession(): void {

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
}


navigateToLogin(): void {

  this.router.navigate(['/login']);
}


verifyOtp(data: {
  email: string;
  otp: string;
}) {
  return this.http.post(
    this.baseUrl + ENDPOINTS.auth.verifyOtp,
    data,
    {
      responseType: 'text'
    }
  );
}

}