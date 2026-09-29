import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { AuthService } from '../../../core/httpServices/auth-service';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-change-password',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    /* PrimeNG */
    CardModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],

  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  readonly authService = inject(AuthService);


  /* ================= FORM ================= */

  form = new FormGroup({

    oldPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })

  });


  /* ================= MESSAGES ================= */

  successMessage = signal('');

  errorMessage = signal('');


  /* ================= SUBMIT ================= */

  submit(): void {

    this.successMessage.set('');

    this.errorMessage.set('');


    /* Check form validation */

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    /* Get form values */

    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = this.form.getRawValue();


    /* Check password confirmation */

    if (newPassword !== confirmPassword) {

      this.errorMessage.set(
        'New password and confirm password do not match.'
      );

      return;
    }


    /* Call backend */

    this.authService
      .changePassword({
        oldPassword,
        newPassword
      })
      .subscribe({

        /* Success */

        next: () => {

          this.successMessage.set(
            'Password changed successfully.'
          );

          this.form.reset();
        },


        /* Error */

        error: (err) => {

          this.errorMessage.set(
            err.error ||
            'Failed to change password.'
          );
        }

      });
  }
}