// import { Component, inject, OnInit, signal } from '@angular/core';
// import { Student } from '../../../models/student.model';
// import { CommonModule } from '@angular/common';
// import { StudentService } from '../student-service';
// import { FeeManager } from '../../fee/fee-manager/fee-manager';
// import { FormsModule } from '@angular/forms';
// import { PaginatorModule } from 'primeng/paginator';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { TableModule } from 'primeng/table';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { ToastModule } from 'primeng/toast';
// import { CourseEnrollment } from '../course-enrollment/course-enrollment';

// @Component({
//   selector: 'app-student-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     FeeManager,
//     ButtonModule,
//     InputTextModule,
//     TableModule,
//     ConfirmDialogModule,
//     ToastModule,
//     PaginatorModule,
//     CourseEnrollment
//   ],
//   templateUrl: './student-list.html',
//   styleUrl: './student-list.css',
//   providers: [ConfirmationService, MessageService]
// })
// export class StudentList implements OnInit {

//   readonly studentService = inject(StudentService);
//   readonly confirmationService = inject(ConfirmationService);
//   readonly messageService = inject(MessageService);

//   students = signal<Student[]>([]);
//   expandedCourseStudentId = signal<number | null>(null);
// expandedFeeStudentId = signal<number | null>(null);

//   searchEmail!: string;

//   currentPage = signal(0);

//   pageSize = signal(10);

//   totalRecords = signal(0);


//   ngOnInit(): void {
//     this.getStudents();
//   }


//   toggleCourseManager(id: number): void {
//   this.expandedCourseStudentId.update(
//     current => current === id ? null : id
//   );
// }

// toggleFeeManager(id: number): void {
//   this.expandedFeeStudentId.update(
//     current => current === id ? null : id
//   );
// }

//   getStudents(): void {

//     this.studentService.getStudentsPaged(
//       this.currentPage(),
//       this.pageSize()
//     ).subscribe({

//       next: (response) => {

//         this.students.set([...response.data.content]);

//         this.totalRecords.set(response.data.totalElements);

//       },

//       error: (err) => {

//         console.error(err);

//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load students.'
//         });

//       }

//     });
//   }


//   onPageChange(event: any): void {

//     this.currentPage.set(event.page);

//     this.pageSize.set(event.rows);

//     this.getStudents();

//   }




//   deleteStudent(id: number): void {

//     this.confirmationService.confirm({

//       message: 'Are you sure you want to delete this student?',
//       header: 'Delete Student',
//       icon: 'pi pi-exclamation-triangle',

//       acceptLabel: 'Delete',
//       rejectLabel: 'Cancel',

//       acceptButtonStyleClass: 'p-button-danger',
//       rejectButtonStyleClass: 'p-button-secondary',

//       accept: () => {

//         this.studentService.deleteStudent(id).subscribe({

//           next: () => {

//             this.getStudents();

//             this.messageService.add({
//               severity: 'success',
//               summary: 'Success',
//               detail: 'Student deleted successfully.'
//             });

//           },

//           error: (error) => {

//             console.error(
//               'Error deleting student:',
//               error
//             );

//             this.messageService.add({
//               severity: 'error',
//               summary: 'Error',
//               detail: 'Failed to delete student.'
//             });

//           }

//         });

//       }

//     });

//   }


//   searchStudent(): void {

//     if (!this.searchEmail) {

//       this.messageService.add({
//         severity: 'warn',
//         summary: 'Search',
//         detail: 'Please enter a Student Email.'
//       });

//       return;
//     }


//     this.studentService.getStudentByEmail(this.searchEmail).subscribe({

//       next: (data) => {

//         this.students.set([data]);

//         this.totalRecords.set(1);

//       },

//       error: () => {

//         this.students.set([]);

//         this.totalRecords.set(0);

//         this.messageService.add({
//           severity: 'warn',
//           summary: 'Not Found',
//           detail: 'Student not found.'
//         });

//       }

//     });

//   }

// } 














import { Component, inject, OnInit, signal } from '@angular/core';
import { Student } from '../../../models/student.model';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student-service';
import { FeeManager } from '../../fee/fee-manager/fee-manager';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { CourseEnrollment } from '../course-enrollment/course-enrollment';

type DrawerMode = 'course' | 'fee' | null;

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeeManager,
    ButtonModule,
    InputTextModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    PaginatorModule,
    DrawerModule,
    CourseEnrollment
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

  // Drawer state
  drawerVisible = signal(false);
  drawerMode = signal<DrawerMode>(null);
  selectedStudent = signal<Student | null>(null);

  searchEmail!: string;

  currentPage = signal(0);
  pageSize = signal(10);
  totalRecords = signal(0);


  ngOnInit(): void {
    this.getStudents();
  }


  // ---------- Drawer ----------

  openDrawer(student: Student, mode: 'course' | 'fee'): void {
    this.selectedStudent.set(student);
    this.drawerMode.set(mode);
    this.drawerVisible.set(true);
  }

  closeDrawer(): void {
    this.drawerVisible.set(false);
  }

  onDrawerVisibleChange(visible: boolean): void {
    this.drawerVisible.set(visible);

    if (!visible) {
      this.drawerMode.set(null);
      this.selectedStudent.set(null);
    }
  }


  // ---------- Students ----------

  getStudents(): void {

    this.studentService.getStudentsPaged(
      this.currentPage(),
      this.pageSize()
    ).subscribe({

      next: (response) => {
        this.students.set([...response.data.content]);
        this.totalRecords.set(response.data.totalElements);
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


  onPageChange(event: any): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.rows);
    this.getStudents();
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

            if (this.selectedStudent()?.id === id) {
              this.onDrawerVisibleChange(false);
            }

            this.getStudents();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student deleted successfully.'
            });
          },

          error: (error) => {
            console.error('Error deleting student:', error);

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
        this.totalRecords.set(1);
      },

      error: () => {
        this.students.set([]);
        this.totalRecords.set(0);

        this.messageService.add({
          severity: 'warn',
          summary: 'Not Found',
          detail: 'Student not found.'
        });
      }

    });

  }

}