import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/httpServices/auth-service';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    })
  });

  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  submit(): void {

    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const email = this.form.getRawValue().email;

    this.authService
      .forgotPassword({ email })
      .subscribe({

        next: () => {

          this.isLoading.set(false);

          this.successMessage.set(
            'OTP has been sent to your email.'
          );

          // Go to reset password page
          this.router.navigate(
            ['/reset-password'],
            {
              queryParams: {
                email: email
              }
            }
          );
        },

        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            err.error || 'Something went wrong.'
          );
        }
      });
  }
}