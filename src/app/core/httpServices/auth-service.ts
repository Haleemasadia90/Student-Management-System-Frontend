import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, SignupRequest } from '../../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl= 'http://localhost:8080/api/auth';

  constructor(private http:HttpClient, private router:Router){}

  signup(data:SignupRequest): Observable<any>{
    return this.http.post(`${this.baseUrl}/signup`,data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username);
      })
    );
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