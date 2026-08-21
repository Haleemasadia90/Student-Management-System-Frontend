import { Component, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/httpServices/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

loginForm = new FormGroup({
  // username:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.minLength(3)]}),
  email:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.email]}),
  password:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.minLength(6)]})
});

errorMessage = signal('');
isLoading=signal(false);

constructor(private authService:AuthService,private router:Router){
   console.log('Login component loaded!');
}

login():void{
  if(this.loginForm.invalid)
  {
    this.loginForm.markAllAsTouched();
    return;
  }

this.isLoading.set(true);
this.errorMessage.set('');

this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Login successful!', response);


         if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
         } else {
         this.router.navigate(['/student/dashboard']);
         }


        
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error || 'Login failed. Try again.');
      }




      
    }

);

}
}
