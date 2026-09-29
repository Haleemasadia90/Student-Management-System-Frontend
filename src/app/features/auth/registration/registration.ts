import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/httpServices/auth-service';
import { DepartmentService } from '../../departments/department-service';
import { Department } from '../../../models/department.model';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardModule, InputTextModule, ButtonModule, MessageModule, PasswordModule, SelectModule, DatePickerModule, InputNumberModule, IconFieldModule, InputIconModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {

  currentStep = signal(1);

  department = signal<Department[]>([]);

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  registrationForm = new FormGroup(
    {
      // Personal Information
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ]
      }),

      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      dateOfBirth: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      gender: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      // Academic Information
      departmentId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      semester: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      admissionYear: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      // Account Information
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6)
        ]
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.department.set(departments);
      },

      error: (error) => {
        console.error('Error loading departments:', error);

        this.errorMessage.set(
          'Unable to load departments.'
        );
      }
    });
  }

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      return {
        passwordMismatch: true
      };
    }

    return null;
  }

  nextStep(): void {

    const step = this.currentStep();

    if (step === 1) {

      const fields = [
        'fullName',
        'email',
        'phone',
        'dateOfBirth',
        'gender'
      ];

      if (!this.isStepValid(fields)) {
        return;
      }

      this.currentStep.set(2);
    }

    else if (step === 2) {

      const fields = [
        'departmentId',
        'semester',
        'admissionYear'
      ];

      if (!this.isStepValid(fields)) {
        return;
      }

      this.currentStep.set(3);
    }
  }

  previousStep(): void {

    if (this.currentStep() > 1) {
      this.currentStep.update(
        step => step - 1
      );
    }
  }

  isStepValid(fields: string[]): boolean {

    let valid = true;

    fields.forEach(fieldName => {

      const control =
        this.registrationForm.get(fieldName);

      if (control?.invalid) {
        control.markAsTouched();
        valid = false;
      }

    });

    return valid;
  }

  register(): void {

    const accountFields = [
      'username',
      'password',
      'confirmPassword'
    ];

    if (!this.isStepValid(accountFields)) {
      return;
    }

    if (
      this.registrationForm.hasError(
        'passwordMismatch'
      )
    ) {
      this.registrationForm
        .get('confirmPassword')
        ?.markAsTouched();

      return;
    }

    this.isLoading.set(true);

    this.errorMessage.set('');
    this.successMessage.set('');

    const formValue =
      this.registrationForm.getRawValue();

    const signupData = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      fullName: formValue.fullName,
      phone: formValue.phone,

      departmentId:
        Number(formValue.departmentId),

      dateOfBirth:
        formValue.dateOfBirth,

      gender:
        formValue.gender,

      semester:
        formValue.semester,

      admissionYear:
        Number(formValue.admissionYear)
    };

    this.authService
      .signup(signupData)
      .subscribe({

        next: () => {

          this.isLoading.set(false);

          this.successMessage.set(
            'Registration successful!'
          );

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },

        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            err.error?.message ||
            err.error ||
            'Registration failed'
          );
        }
      });
  }
}