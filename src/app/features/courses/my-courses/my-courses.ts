import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentService } from '../../student/student-service';
import { CourseService } from '../course-service';

import { Student } from '../../../models/student.model';
import { Course } from '../../../models/course.model';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
    ButtonModule,
    TagModule,
    TableModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCourses implements OnInit {

  readonly studentService = inject(StudentService);
  readonly courseService = inject(CourseService);

  myRecord = signal<Student | null>(null);
  availableCourses = signal<Course[]>([]);
  errorMessage = signal('');

  ngOnInit(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => {
        this.myRecord.set(data);

        if (data.departmentId) {
          this.loadAvailableCourses(data.departmentId);
        }
      },

      error: (err) => {
        console.error('Error fetching record:', err);
      }
    });
  }

  loadAvailableCourses(departmentId: number): void {
    this.courseService.getAllCourses(departmentId).subscribe({
      next: (data) => {
        this.availableCourses.set(data);
      },

      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  enroll(courseId: number): void {
    this.errorMessage.set('');

    this.studentService.enrollInCourse(courseId).subscribe({
      next: (updatedRecord) => {
        this.myRecord.set(updatedRecord);
      },

      error: (err) => {
        this.errorMessage.set(
          err.error || 'Enrollment failed.'
        );
      }
    });
  }

  getCreditPercentage(): number {
    const record = this.myRecord();

    if (!record || !record.maxCreditHours) {
      return 0;
    }

    return Math.min(
      (record.totalCreditHours / record.maxCreditHours) * 100,
      100
    );
  }
}