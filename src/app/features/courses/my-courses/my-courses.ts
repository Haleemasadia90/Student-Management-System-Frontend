import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentService } from '../../student/student-service';
import { CourseService } from '../course-service';
import { EnrollmentService } from '../../../core/httpServices/enrollment-service';

import { Student } from '../../../models/student.model';
import { Course } from '../../../models/course.model';
import { Enrollment } from '../../../models/enrollment.model';

import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const MAX_CREDIT_HOURS = 18;

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, ProgressBarModule, ButtonModule,
    TagModule, TableModule, MessageModule, SelectModule, ProgressSpinnerModule
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCourses implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly courseService = inject(CourseService);
  private readonly enrollmentService = inject(EnrollmentService);

  myRecord = signal<Student | null>(null);
  enrollments = signal<Enrollment[]>([]);
  creditHours = signal(0);
  errorMessage = signal('');
  loadingEnrollments = signal(false);

  // Available courses (server-side pagination)
  availableCourses = signal<Course[]>([]);
  loadingCourses = signal(false);
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);

  readonly maxCreditHours = MAX_CREDIT_HOURS;

  semester = '';
  semesters: { label: string; value: string }[] = [];

  ngOnInit(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => {
        this.myRecord.set(data);
        this.buildSemesters(data.admissionYear);

        const current = (data as any).currentSemester;
        this.semester = this.semesters.some(s => s.value === current)
          ? current
          : this.semesters[0]?.value ?? '';

        // Available courses are loaded by the table's own onLazyLoad event.
        this.loadEnrollments();
      },
      error: (err) => console.error('Error fetching record:', err)
    });
  }

  private buildSemesters(admissionYear: number | null | undefined): void {
    const year = Number(admissionYear);
    if (!Number.isInteger(year) || year < 1900) {
      this.semesters = [];
      return;
    }
    const result: { label: string; value: string }[] = [];
    for (let i = 0; i < 4; i++) {
      result.push(
        { label: `Fall ${year + i}`, value: `Fall ${year + i}` },
        { label: `Summer ${year + i}`, value: `Summer ${year + i}` }
      );
    }
    this.semesters = result;
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;

    this.first.set(first);
    this.rows.set(rows);

    this.loadAvailableCourses(Math.floor(first / rows), rows);
  }

  private loadAvailableCourses(page: number = 0, size: number = 10): void {
    const departmentId = this.myRecord()?.departmentId;

    if (!departmentId) {
      this.availableCourses.set([]);
      this.totalRecords.set(0);
      return;
    }

    this.loadingCourses.set(true);

    this.courseService
      .getAvailableCoursesPaged(departmentId, page, size)
      .subscribe({
        next: (response) => {
          this.availableCourses.set([...response.data.content]);
          this.totalRecords.set(response.data.totalElements);
          this.loadingCourses.set(false);
        },
        error: (err) => {
          console.error('Error loading courses:', err);
          this.availableCourses.set([]);
          this.totalRecords.set(0);
          this.loadingCourses.set(false);
        }
      });
  }

  onSemesterChange(): void {
    this.errorMessage.set('');
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    if (!this.semester) {
      this.enrollments.set([]);
      this.creditHours.set(0);
      return;
    }

    this.loadingEnrollments.set(true);
    this.enrollmentService.getMyEnrollmentsBySemester(this.semester).subscribe({
      next: (data) => {
        this.enrollments.set(data);
        this.creditHours.set(data.reduce((s, e) => s + e.creditHours, 0));
        this.loadingEnrollments.set(false);
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.loadingEnrollments.set(false);
      }
    });
  }

  isEnrolled(courseId: number): boolean {
    return this.enrollments().some(e => e.courseId === courseId);
  }

  wouldExceedLimit(course: Course): boolean {
    return this.creditHours() + course.creditHours > MAX_CREDIT_HOURS;
  }

  enroll(course: Course): void {
    this.errorMessage.set('');

    this.enrollmentService.enrollMyCourse(course.id, this.semester).subscribe({
      next: () => this.loadEnrollments(),
      error: (err) =>
        this.errorMessage.set(
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : 'Enrollment failed.')
        )
    });
  }

  getCreditPercentage(): number {
    return Math.min((this.creditHours() / MAX_CREDIT_HOURS) * 100, 100);
  }
}