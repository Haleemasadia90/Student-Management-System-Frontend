import { Component, inject, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../course-service';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CourseRequest } from '../../../models/course.model';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../departments/department-service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse implements OnInit {
  readonly courseService = inject(CourseService);
  readonly departmentService = inject(DepartmentService);

  @Output() courseAdded = new EventEmitter<void>();

  departments = signal<Department[]>([]);

  courseForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    courseCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    creditHours: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    status: new FormControl('ACTIVE', { nonNullable: true, validators: [Validators.required] }),
    departmentId: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  ngOnInit(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error loading departments:', err)
    });
  }

  save(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const courseData = this.courseForm.getRawValue() as CourseRequest;

    this.courseService.createCourse(courseData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Course added successfully');
        this.courseForm.reset({ creditHours: 1, status: 'ACTIVE', departmentId: null });
        this.courseAdded.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error || 'Failed to add new course.');
      }
    });
  }
}