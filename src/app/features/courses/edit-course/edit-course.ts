import { Component, inject, signal, Input, Output, EventEmitter, OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';

import { CourseService } from '../course-service';
import { Course, CourseRequest } from '../../../models/course.model';

import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../departments/department-service';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-course',
  standalone: true,

  imports: [ CommonModule,  ReactiveFormsModule, ButtonModule, ToastModule, InputTextModule,   SelectModule, InputNumberModule, FloatLabelModule],

  providers: [MessageService],

  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css'
})
export class EditCourse implements OnInit {

  readonly courseService = inject(CourseService);
  readonly departmentService = inject(DepartmentService);
  readonly messageService = inject(MessageService);

  @Input() courseId!: number;

  @Output() courseUpdated = new EventEmitter<void>();

  departments = signal<Department[]>([]);
  isLoading = signal(false);

  courseForm = new FormGroup({

    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    courseCode: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    creditHours: new FormControl(1, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),

    status: new FormControl('ACTIVE', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    departmentId: new FormControl<number | null>(null, {
      validators: [
        Validators.required
      ]
    })

  });


  statusOptions = [
    {
      label: 'Active',
      value: 'ACTIVE'
    },
    {
      label: 'Inactive',
      value: 'INACTIVE'
    },
    {
      label: 'Upcoming',
      value: 'UPCOMING'
    }
  ];


  ngOnInit(): void {

    this.loadDepartments();

    this.loadCourse();

  }


  loadDepartments(): void {

    this.departmentService
      .getAllDepartments()
      .subscribe({

        next: (data) => {

          this.departments.set(data);

        },

        error: (err) => {

          console.error(
            'Error loading departments:',
            err
          );

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load departments.',
            life: 4000
          });

        }

      });

  }


  loadCourse(): void {

    if (!this.courseId) {
      return;
    }

    this.isLoading.set(true);

    this.courseService
      .getCourseById(this.courseId)
      .subscribe({

        next: (course: Course) => {

          this.courseForm.patchValue({

            title: course.title,

            description: course.description,

            courseCode: course.courseCode,

            creditHours: course.creditHours,

            status: course.status,

            departmentId: course.departmentId

          });

          this.isLoading.set(false);

        },

        error: (err) => {

          console.error(
            'Error loading course:',
            err
          );

          this.isLoading.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load course.',
            life: 4000
          });

        }

      });

  }


  save(): void {

    if (this.courseForm.invalid) {

      this.courseForm.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields.',
        life: 3000
      });

      return;

    }

    this.isLoading.set(true);

    const courseData =
      this.courseForm.getRawValue() as CourseRequest;


    this.courseService
      .updateCourse(
        this.courseId,
        courseData
      )
      .subscribe({

        next: () => {

          this.isLoading.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Course updated successfully.',
            life: 3000
          });

          this.courseUpdated.emit();

        },

        error: (err) => {

          this.isLoading.set(false);

          console.error(
            'Error updating course:',
            err
          );

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error ||
              'Failed to update course.',
            life: 4000
          });

        }

      });

  }

}