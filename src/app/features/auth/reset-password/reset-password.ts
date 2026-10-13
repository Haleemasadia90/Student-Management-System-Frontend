import { Component,  inject, OnDestroy, OnInit, signal} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormControl,FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

import { ActivatedRoute, Router,RouterLink} from '@angular/router';

import { AuthService } from '../../../core/httpServices/auth-service';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputOtpModule } from 'primeng/inputotp';


@Component({
  selector: 'app-reset-password',
  standalone: true,

  imports: [ CommonModule, ReactiveFormsModule, RouterLink,  CardModule, InputTextModule, PasswordModule,  
    ButtonModule, MessageModule, InputOtpModule],

  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit, OnDestroy {

  readonly authService = inject(AuthService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);


  email = '';

  isRegistrationMode = false;


  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  otpVerified = signal(false);
  resendDisabled = signal(true);
  resendSeconds = signal(30);
  resendLoading = signal(false);

  private resendTimer: ReturnType<typeof setInterval> | null = null;



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

    const mode =
      this.route.snapshot.queryParamMap.get('mode');

    this.isRegistrationMode =
      mode === 'registration';


    if (!this.email) {

      this.errorMessage.set(
        'Email is missing. Please request a new OTP.'
      );

      return;
    }


    this.startResendTimer();
  }

  continueWithOtp(): void {

    this.successMessage.set('');

    this.errorMessage.set('');


    const otpControl =
      this.form.controls.otp;


    // Validate OTP
    if (otpControl.invalid) {

      otpControl.markAsTouched();

      return;
    }


    // Validate email
    if (!this.email) {

      this.errorMessage.set(
        'Email is missing. Please request a new OTP.'
      );

      return;
    }


    this.isLoading.set(true);


    if (this.isRegistrationMode) {

      this.authService
        .verifyRegistrationOtp({

          email: this.email,

          otp: otpControl.value

        })
        .subscribe({

          next: () => {

            this.isLoading.set(false);

            this.successMessage.set(
              'Email verified successfully! Registration completed. Redirecting to login...'
            );


            setTimeout(() => {

              this.router.navigate(['/login']);

            }, 1500);

          },


          error: (err) => {

            this.isLoading.set(false);

            this.errorMessage.set(
              err.error || 'Invalid or expired OTP.'
            );

          }

        });

      return;
    }


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


  resendOtp(): void {

    if (
      this.resendDisabled() ||
      this.resendLoading() ||
      !this.email
    ) {
      return;
    }


    this.successMessage.set('');

    this.errorMessage.set('');

    this.resendLoading.set(true);


    if (this.isRegistrationMode) {

      this.authService
        .resendRegistrationOtp(this.email)
        .subscribe({

          next: () => {

            this.resendLoading.set(false);

            this.form.controls.otp.reset();

            this.successMessage.set(
              'A new registration OTP has been sent to your email.'
            );

            this.startResendTimer();

          },


          error: (err) => {

            this.resendLoading.set(false);

            this.errorMessage.set(
              err.error || 'Unable to resend OTP.'
            );

          }

        });

      return;
    }


    this.authService
      .resendForgotPasswordOtp(this.email)
      .subscribe({

        next: () => {

          this.resendLoading.set(false);

          this.form.controls.otp.reset();

          this.successMessage.set(
            'A new OTP has been sent to your email.'
          );

          this.startResendTimer();

        },


        error: (err) => {

          this.resendLoading.set(false);

          this.errorMessage.set(
            err.error || 'Unable to resend OTP.'
          );

        }

      });
  }



  startResendTimer(): void {

    if (this.resendTimer) {

      clearInterval(this.resendTimer);

    }


    this.resendSeconds.set(30);

    this.resendDisabled.set(true);


    this.resendTimer = setInterval(() => {

      const seconds =
        this.resendSeconds();


      if (seconds <= 1) {

        this.resendSeconds.set(0);

        this.resendDisabled.set(false);

        if (this.resendTimer) {

          clearInterval(this.resendTimer);

          this.resendTimer = null;

        }

        return;
      }


      this.resendSeconds.set(seconds - 1);

    }, 1000);
  }



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


  ngOnDestroy(): void {

    if (this.resendTimer) {

      clearInterval(this.resendTimer);

      this.resendTimer = null;

    }
  }

}