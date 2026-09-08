import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../student/student-service';
import { CourseService } from '../course-service';
import { Student } from '../../../models/student.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
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
      error: (err) => console.error('Error fetching record:', err)
    });
  }

  loadAvailableCourses(departmentId: number): void {
    this.courseService.getAllCourses(departmentId).subscribe({
      next: (data) => this.availableCourses.set(data)
    });
  }

  enroll(courseId: number): void {
    this.errorMessage.set('');
    this.studentService.enrollInCourse(courseId).subscribe({
      next: (updatedRecord) => this.myRecord.set(updatedRecord),
      error: (err) => this.errorMessage.set(err.error || 'Enrollment failed.')
    });
  }
}