
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseService } from '../course-service';
import { Course } from '../../../models/course.model';

import { AddCourse } from '../add-course/add-course';
import { EditCourse } from '../edit-course/edit-course';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import {
  TableModule,
  TableLazyLoadEvent
} from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// PrimeNG Services
import {
  MessageService,
  ConfirmationService
} from 'primeng/api';

import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-course-list',

  imports: [
    CommonModule,
    AddCourse,
    EditCourse,
    ButtonModule,
    TableModule,
    DrawerModule,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    SelectModule
  ],

  templateUrl: './course-list.html',
  styleUrl: './course-list.css',

  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class CourseList {

  // Services
  readonly courseService = inject(CourseService);

  readonly messageService = inject(MessageService);

  readonly confirmationService =
    inject(ConfirmationService);

  // Course Table State
  courses = signal<Course[]>([]);

  totalRecords = signal(0);

  loading = signal(false);

  // Pagination State
  first = signal(0);

  rows = signal(10);

  // Drawer State
  drawerVisible = false;

  isEditMode = false;

  selectedCourseId = signal<number | null>(null);


  // Open Drawer for Adding a Course
  openAddDrawer(): void {
    this.selectedCourseId.set(null);

    this.isEditMode = false;

    this.drawerVisible = true;
  }


  // Open Drawer for Editing a Course
  editCourse(id: number): void {
    this.selectedCourseId.set(id);

    this.isEditMode = true;

    this.drawerVisible = true;
  }


  // Close Drawer and Reset Its State
  closeDrawer(): void {
    this.drawerVisible = false;

    this.isEditMode = false;

    this.selectedCourseId.set(null);
  }


  // Called After a Course Is Successfully Added
  onCourseAdded(): void {
    this.closeDrawer();

    // Return to the first page
    this.first.set(0);

    // Refresh the course table
    this.getCourses();
  }


  // Called After a Course Is Successfully Updated
  onCourseUpdated(): void {
    this.closeDrawer();

    // Refresh the current page
    this.getCourses();
  }


  // Handle PrimeNG Lazy Loading and Pagination
  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);

    this.rows.set(event.rows ?? 10);

    this.getCourses();
  }


  // Fetch Paginated Courses from the Backend
  getCourses(): void {
    const page = Math.floor(
      this.first() / this.rows()
    );

    this.loading.set(true);

    this.courseService
      .getCoursesPaged(page, this.rows())
      .subscribe({

        next: (res) => {
          this.courses.set(res.data.content);

          this.totalRecords.set(
            res.data.totalElements
          );

          this.loading.set(false);
        },

        error: (err) => {
          console.error(
            'Error fetching courses:',
            err
          );

          this.loading.set(false);
        }

      });
  }


  // Delete Course with Confirmation
  deleteCourse(id: number): void {

    this.confirmationService.confirm({

      message:
        'Are you sure you want to delete this course?',

      header: 'Delete Course',

      icon: 'pi pi-exclamation-triangle',

      accept: () => {

        this.courseService
          .deleteCourse(id)
          .subscribe({

            next: () => {

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Course deleted successfully!',
                life: 3000
              });

              // Move to the previous page if
              // the last row on a page was deleted
              if (
                this.courses().length === 1 &&
                this.first() > 0
              ) {
                this.first.set(
                  this.first() - this.rows()
                );
              }

              // Refresh the table
              this.getCourses();

            },

            error: () => {

              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete course.',
                life: 3000
              });

            }

          });

      }

    });

  }

}
