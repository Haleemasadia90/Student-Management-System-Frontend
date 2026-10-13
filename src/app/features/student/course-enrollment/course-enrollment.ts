import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { Course } from '../../../models/course.model';
import { Enrollment } from '../../../models/enrollment.model';
import { CourseService } from '../../courses/course-service';
import { EnrollmentService } from '../../../core/httpServices/enrollment-service';

@Component({
  selector: 'app-course-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './course-enrollment.html',
  styleUrl: './course-enrollment.css',
  providers: [ConfirmationService, MessageService]
})
export class CourseEnrollment implements OnChanges {
  @Input({ required: true }) studentId!: number;
  @Input() admissionYear = new Date().getFullYear();

  /** Fires after an enrollment is added/removed (the fee changes with it). */
  @Output() changed = new EventEmitter<void>();

  private readonly courseService = inject(CourseService);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  courses = signal<Course[]>([]);
  activeCourses = signal<Course[]>([]);
  enrollments = signal<Enrollment[]>([]);
  creditHours = signal(0);
  loading = signal(false);

  semester = '';

  semesters: { label: string; value: string }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['studentId'] || changes['admissionYear']) {
      this.buildSemesters();

      if (!this.semesters.some(s => s.value === this.semester)) {
        this.semester = this.semesters[0]?.value ?? '';
      }

      this.loadCourses();
      this.loadSemesterData();
    }
  }

  private buildSemesters(): void {
    const year = Number(this.admissionYear);

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

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses.set(courses);
        this.activeCourses.set(
          courses.filter(c => c.status?.trim().toUpperCase() === 'ACTIVE')
        );
      },
      error: (error) => {
        console.error('Failed to load courses:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load courses.'
        });
      }
    });
  }

  onSemesterChange(): void {
    this.loadSemesterData();
  }

  loadSemesterData(): void {
    if (!this.studentId || !this.semester) {
      this.enrollments.set([]);
      this.creditHours.set(0);
      return;
    }

    this.loading.set(true);

    this.enrollmentService
      .getStudentEnrollmentsBySemester(this.studentId, this.semester)
      .subscribe({
        next: (data) => {
          this.enrollments.set(data);
          this.creditHours.set(
            data.reduce((sum, item) => sum + item.creditHours, 0)
          );
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load enrollments:', error);
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load semester enrollments.'
          });
        }
      });
  }

  isEnrolled(courseId: number): boolean {
    return this.enrollments().some(e => e.courseId === courseId);
  }

  enroll(course: Course): void {
    if (this.isEnrolled(course.id)) {
      return;
    }

    if (this.creditHours() + course.creditHours > 18) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Credit-hour limit',
        detail: 'Maximum 18 credit hours are allowed per semester.'
      });
      return;
    }

    this.enrollmentService
      .enrollStudent(this.studentId, course.id, this.semester)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Enrolled',
            detail: `${course.courseCode} added to ${this.semester}. Fee updated.`
          });
          this.loadSemesterData();
          this.changed.emit();
        },
        error: (error) => {
          console.error('Enrollment failed:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Enrollment failed',
            detail: error?.error?.message ?? 'Could not enroll in this course.'
          });
        }
      });
  }

  removeEnrollment(enrollment: Enrollment): void {
    this.confirmationService.confirm({
      header: 'Remove Course',
      message: `Remove ${enrollment.courseCode} from ${enrollment.semester}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      accept: () => {
        this.enrollmentService
          .removeEnrollment(enrollment.id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Removed',
                detail: 'Course removed from this semester. Fee updated.'
              });
              this.loadSemesterData();
              this.changed.emit();
            },
            error: (error) => {
              console.error('Removal failed:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not remove the enrollment.'
              });
            }
          });
      }
    });
  }
}

