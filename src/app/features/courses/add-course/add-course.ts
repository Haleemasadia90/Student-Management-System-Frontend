import { Component,EventEmitter,inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../course-service';
import { FormGroup, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { CourseRequest } from '../../../models/course.model';


@Component({
  selector: 'app-add-course',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse {
  readonly courseService = inject(CourseService);

  @Output() courseAdded = new EventEmitter<void>();

  courseForm = new FormGroup({
    title: new FormControl('',{ nonNullable: true, validators:[Validators.required]}),
    description: new FormControl('',{nonNullable:true,validators:[Validators.required]}),
    courseCode: new FormControl('',{nonNullable:true, validators:[Validators.required]}),
    creditHours: new FormControl(1,{nonNullable:true,validators:[Validators.required]}),
    status:new FormControl('ACTIVE', {nonNullable:true, validators:[Validators.required]}),

  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);



  save():void{
    if(this.courseForm.invalid)
    {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

     const courseData: CourseRequest = this.courseForm.getRawValue();

    this.courseService.createCourse(courseData).subscribe({

      next:()=>{
        this.isLoading.set(false);
        this.successMessage.set('Course added successfully');
        this.courseForm.reset({creditHours:1, status: 'ACTIVE'});
         this.courseAdded.emit();  
      },

      error: (err)=>{
        this.isLoading.set(false);
        this.errorMessage.set(err.error || 'Failed to add new course.');
        
      }
    });
  }
}
