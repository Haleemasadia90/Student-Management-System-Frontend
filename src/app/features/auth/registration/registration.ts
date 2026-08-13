import { Component,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators,ReactiveFormsModule,  ValidationErrors,AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/httpServices/auth-service';


@Component({
  selector: 'app-registration',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {

  registrationForm=new FormGroup({
    username:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.minLength(3)]}),
    email:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.email]}),
    password:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.minLength(6)]}),
    confirmPassword:new FormControl('',{nonNullable:true,validators:[Validators.required]})
  }
  ,
    {
      validators: this.passwordMatchValidator
    })

   errorMessage = signal('');
   successMessage = signal('');
   isLoading = signal(false);


constructor(private autrhService : AuthService, private router : Router){}


      passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  register(): void {

    if (this.registrationForm.invalid) {

      this.registrationForm.markAllAsTouched();
      return;

    }


  this.isLoading.set(true);
  this.errorMessage.set('');

  const{username,email,password} = this.registrationForm.getRawValue();

  this.autrhService.signup({username,email,password}).subscribe({
    next:()=>{
      this.isLoading.set(false);
      this.successMessage.set('Registration successful!');
      setTimeout(()=>{
        this.router.navigate(['/login']);},1000);
      },
    error:(err)=>{
      this.isLoading.set(false);
      this.errorMessage.set(err.error || 'Registration failed');
    }  
    });
    }
  }
  

