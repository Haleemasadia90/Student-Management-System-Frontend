import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { StudentService } from '../../student/student-service';
import { CourseService } from '../../courses/course-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  readonly authService = inject(AuthService);
  readonly studentService = inject(StudentService);
  readonly courseService = inject(CourseService);

  totalStudents = signal(0);
  totalCourses = signal(0);

  get username(): string | null {
    return this.authService.getUsername();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.totalStudents.set(students.length);
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });

    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.totalCourses.set(courses.length);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }
}