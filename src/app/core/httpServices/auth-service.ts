import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, LoginResponse, ResetPasswordRequest, SignupRequest } from '../../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../../../environments/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    baseUrl = environment.apiUrl;
    readonly http = inject(HttpClient);
    readonly router = inject(Router);

 

  // signup(data:SignupRequest): Observable<any>{
  //   return this.http.post(`${this.baseUrl}/signup`,data);
  // }

  signup(data: SignupRequest) {
  return this.http.post(this.baseUrl + ENDPOINTS.auth.signup, data);
  
}

changePassword(data: ChangePasswordRequest) {
    return this.http.put(this.baseUrl + ENDPOINTS.auth.changePassword, data, { responseType: 'text' });
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + ENDPOINTS.auth.login, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username);
      })
    );
  }

forgotPassword(data: ForgotPasswordRequest) {
  return this.http.post(this.baseUrl + ENDPOINTS.auth.forgotPassword, data, { responseType: 'text' });
}

resetPassword(data: ResetPasswordRequest) {
  return this.http.post(this.baseUrl + ENDPOINTS.auth.resetPassword, data, { responseType: 'text' });
}
  
  getToken():string | null{
return localStorage.getItem('token');
  }


  getRole():string | null{
    return localStorage.getItem('role');
  }

  getUsername():string | null{
    return localStorage.getItem('username');
  }

  isLoggedIn():boolean{
    return !!this.getToken();
  }

   logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}