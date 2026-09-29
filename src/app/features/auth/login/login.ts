import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AuthService } from '../../../core/httpServices/auth-service';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule,  } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardModule,InputTextModule,
    PasswordModule,ButtonModule, MessageModule,InputIconModule,IconFieldModule],

  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {



  loginForm = new FormGroup({

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    })

  });



  errorMessage = signal('');

  isLoading = signal(false);

  showPassword = signal(false);



  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log('Login component loaded!');
  }



  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }


    this.isLoading.set(true);

    this.errorMessage.set('');


    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({

        next: (response) => {

          this.isLoading.set(false);

          console.log(
            'Login successful!',
            response
          );

          if (response.role === 'ADMIN') {

            this.router.navigate([
              '/admin/dashboard'
            ]);

          } else {

            this.router.navigate([
              '/student/dashboard'
            ]);

          }

        },


        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            err.error ||
            'Login failed. Please check your credentials.'
          );

        }

      });
  }


  togglePassword(): void {

    this.showPassword.update(
      value => !value
    );
  }

}