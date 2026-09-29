import {
  Component,
  inject,
  signal,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import { CourseService } from '../course-service';
import { CourseRequest } from '../../../models/course.model';

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
  selector: 'app-add-course',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    FloatLabelModule
  ],

  providers: [MessageService],

  templateUrl: './add-course.html',
  styleUrl: './add-course.css'
})
export class AddCourse implements OnInit {

  readonly courseService = inject(CourseService);
  readonly departmentService = inject(DepartmentService);
  readonly messageService = inject(MessageService);

  @Output() courseAdded = new EventEmitter<void>();

  departments = signal<Department[]>([]);


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


  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);


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

    this.departmentService.getAllDepartments().subscribe({

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

    this.errorMessage.set('');
    this.successMessage.set('');


    const courseData =
      this.courseForm.getRawValue() as CourseRequest;


    this.courseService.createCourse(courseData).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Course added successfully.',
          life: 3000
        });


        this.courseForm.reset({

          title: '',
          description: '',
          courseCode: '',
          creditHours: 1,
          status: 'ACTIVE',
          departmentId: null

        });


        this.courseAdded.emit();

      },


      error: (err) => {

        this.isLoading.set(false);

        console.error(
          'Error adding course:',
          err
        );


        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            err.error ||
            'Failed to add new course.',
          life: 4000
        });

      }

    });

  }

}