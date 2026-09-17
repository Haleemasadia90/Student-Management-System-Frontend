import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { StudentService } from '../../student/student-service';
import { CourseService } from '../../courses/course-service';
import { DepartmentService } from '../../departments/department-service';
import { FeeSummary } from '../../../models/fee.model';
import { CommonModule } from '@angular/common';
import { FeeService } from '../../fee/fee-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  readonly authService = inject(AuthService);
  readonly studentService = inject(StudentService);
  readonly courseService = inject(CourseService);
  readonly departmentService = inject(DepartmentService);
  readonly feeService = inject(FeeService);

  totalStudents = signal(0);
  totalCourses = signal(0);
  totalDepartments = signal(0);
  feeSummary = signal<FeeSummary | null>(null);

  get username(): string | null {
    return this.authService.getUsername();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.studentService.getTotalStudentsCount().subscribe({
      next: (count) => {
        this.totalStudents.set(count);
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });

    this.courseService.getTotalCoursesCount().subscribe({
      next: (count) => {
        this.totalCourses.set(count);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });

    this.departmentService.getTotalDepartmentsCount().subscribe({
      next: (count) => {
        this.totalDepartments.set(count);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });

    this.feeService.getOverallFeeSummary().subscribe({
      next: (summary) => this.feeSummary.set(summary),
      error: (err) => console.error('Error loading fee summary:', err)
    });
  }
}