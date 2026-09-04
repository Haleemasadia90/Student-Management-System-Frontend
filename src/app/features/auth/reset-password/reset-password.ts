
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/httpServices/auth-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  readonly authService = inject(AuthService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  token: string = '';

  form = new FormGroup({
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  successMessage = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage.set('Invalid or missing reset link.');
    }
  }

  submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.authService.resetPassword({ token: this.token, newPassword }).subscribe({
      next: () => {
        this.successMessage.set('Password reset! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => this.errorMessage.set(err.error || 'Failed to reset password.')
    });
  }
}