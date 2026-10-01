import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/httpServices/auth-service';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  readonly authService = inject(AuthService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  email = '';

  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  // Controls which step is visible
  otpVerified = signal(false);


  form = new FormGroup({

    otp: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    }),

    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })

  });


  ngOnInit(): void {

    this.email =
      this.route.snapshot.queryParamMap.get('email') || '';

    if (!this.email) {

      this.errorMessage.set(
        'Email is missing. Please request a new OTP.'
      );

    }
  }


  /**
   * STEP 1
   * Verify OTP
   */
  continueWithOtp(): void {

    this.successMessage.set('');
    this.errorMessage.set('');

    const otpControl = this.form.controls.otp;

    if (otpControl.invalid) {

      otpControl.markAsTouched();

      return;
    }

    if (!this.email) {

      this.errorMessage.set(
        'Email is missing. Please request a new OTP.'
      );

      return;
    }


    this.isLoading.set(true);


    this.authService
      .verifyOtp({

        email: this.email,
        otp: otpControl.value

      })
      .subscribe({

        next: () => {

          this.isLoading.set(false);

          this.otpVerified.set(true);

          this.successMessage.set(
            'OTP verified successfully. Now create your new password.'
          );

        },

        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            err.error || 'Invalid or expired OTP.'
          );

        }

      });
  }


  /**
   * STEP 2
   * Reset password
   */
  resetPassword(): void {

    this.successMessage.set('');
    this.errorMessage.set('');


    const newPasswordControl =
      this.form.controls.newPassword;

    const confirmPasswordControl =
      this.form.controls.confirmPassword;


    if (
      newPasswordControl.invalid ||
      confirmPasswordControl.invalid
    ) {

      newPasswordControl.markAsTouched();
      confirmPasswordControl.markAsTouched();

      return;
    }


    const {
      otp,
      newPassword,
      confirmPassword
    } = this.form.getRawValue();


    if (newPassword !== confirmPassword) {

      this.errorMessage.set(
        'Passwords do not match.'
      );

      return;
    }


    this.isLoading.set(true);


    this.authService
      .resetPassword({

        email: this.email,
        otp: otp,
        newPassword: newPassword

      })
      .subscribe({

        next: () => {

          this.isLoading.set(false);

          this.successMessage.set(
            'Password reset successfully. Redirecting to login...'
          );


          // Automatically navigate to login
          setTimeout(() => {

            this.router.navigate(['/login']);

          }, 1500);

        },

        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            err.error || 'Unable to reset password.'
          );

        }

      });
  }
}