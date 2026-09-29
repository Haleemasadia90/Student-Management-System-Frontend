import { Component, inject, OnInit, signal } from '@angular/core';
import { Student } from '../../../models/student.model';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student-service';
import { FeeManager } from '../../fee/fee-manager/fee-manager';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule,FormsModule,FeeManager,ButtonModule,InputTextModule, TableModule,ConfirmDialogModule,ToastModule
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
  providers: [ConfirmationService, MessageService]
})
export class StudentList implements OnInit {

  readonly studentService = inject(StudentService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);

  students = signal<Student[]>([]);
  expandedStudentId = signal<number | null>(null);

  searchEmail!: string;

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students.set([...data]);
      },
      error: (err) => {
        console.error(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load students.'
        });
      }
    });
  }

  toggleFeeManager(id: number): void {
    this.expandedStudentId.set(
      this.expandedStudentId() === id ? null : id
    );
  }

  deleteStudent(id: number): void {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student?',
      header: 'Delete Student',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',

      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',

      accept: () => {

        this.studentService.deleteStudent(id).subscribe({

          next: () => {

            this.getStudents();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student deleted successfully.'
            });
          },

          error: (error) => {

            console.error(
              'Error deleting student:',
              error
            );

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete student.'
            });
          }

        });

      }
    });
  }

searchStudent(): void {

  if (!this.searchEmail) {

    this.messageService.add({
      severity: 'warn',
      summary: 'Search',
      detail: 'Please enter a Student Email.'
    });

    return;
  }

  this.studentService.getStudentByEmail(this.searchEmail).subscribe({

    next: (data) => {
      this.students.set([data]);
    },

    error: () => {

      this.students.set([]);

      this.messageService.add({
        severity: 'warn',
        summary: 'Not Found',
        detail: 'Student not found.'
      });

    }

  });
}
}