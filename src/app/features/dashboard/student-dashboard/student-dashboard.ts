// import { Component,inject, OnInit , signal } from '@angular/core';
// import { AuthService } from '../../../core/httpServices/auth-service';
// import { Router } from '@angular/router';
// import { Student } from '../../../models/student.model';
// import { StudentService } from '../../student/student-service';
// import { CommonModule } from '@angular/common';
// import { FeeService } from '../../fee/fee-service';
// import { Fee } from '../../../models/fee.model';
// import { Course } from '../../../models/course.model';
// import { CourseService } from '../../courses/course-service';

// @Component({
//   selector: 'app-student-dashboard',
//     standalone: true,
//   imports: [CommonModule],
//   templateUrl: './student-dashboard.html',
//   styleUrl: './student-dashboard.css',
// })
// export class StudentDashboard implements OnInit {
//   readonly studentService = inject(StudentService);
//   readonly authService = inject(AuthService);
//   readonly feeService = inject(FeeService);
//   readonly router = inject(Router);
//   readonly courseService = inject(CourseService);

//   myRecord = signal<Student | null>(null);
//   myFees = signal<Fee[]>([]);
//   availableCourses = signal<Course[]>([]);
//   errorMessage = signal('');

//    get username(): string | null {
//   return this.authService.getUsername();
// }

// ngOnInit(): void {
//     this.studentService.getMyRecord().subscribe({
//       next: (data) => {
//       this.myRecord.set(data);
    
//       if (data.departmentId) {
//         this.loadAvailableCourses(data.departmentId);
//       }
//     },
//       error: (err) => console.error('Error fetching record:', err)
//     });

//     this.feeService.getMyFees().subscribe(
//       {
//         next:(data)=>this.myFees.set(data),
//         error:(err)=>console.error('Error fetching fees:',err)
//       }
//     );
//   }

// loadAvailableCourses(departmentId: number): void {
//   this.courseService.getAllCourses(departmentId).subscribe({
//     next: (data) => this.availableCourses.set(data)
//   });
// }

// enroll(courseId: number): void {
//   this.errorMessage.set('');
//   this.studentService.enrollInCourse(courseId).subscribe({
//     next: (updatedRecord) => {
//       this.myRecord.set(updatedRecord);
//     },
//     error: (err) => {
//       this.errorMessage.set(err.error || 'Enrollment failed.');
//     }
//   });
// }




//   logout(): void {
//     this.authService.logout();
//   }

// }


import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../student/student-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  readonly studentService = inject(StudentService);
  readonly authService = inject(AuthService);

  myRecord = signal<Student | null>(null);

  get username(): string | null {
    return this.authService.getUsername();
  }

  ngOnInit(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => this.myRecord.set(data),
      error: (err) => console.error('Error fetching record:', err)
    });
  }

  onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  this.studentService.uploadProfilePicture(file).subscribe({
    next: () => {
      this.studentService.getMyRecord().subscribe(data => this.myRecord.set(data));
      this.studentService.notifyProfileUpdated();  
    },
    error: (err) => console.error('Upload failed:', err)
  });
}
}