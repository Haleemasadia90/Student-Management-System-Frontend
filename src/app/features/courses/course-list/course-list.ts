// import { Component, inject, OnInit, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CourseService } from '../course-service';
// import { Course } from '../../../models/course.model';
// import { AddCourse } from '../add-course/add-course';
// import { ButtonModule } from 'primeng/button';
// import {TableModule } from 'primeng/table';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { ConfirmationService } from 'primeng/api';

// @Component({
//   selector: 'app-course-list',
//   imports: [CommonModule, AddCourse, ButtonModule, TableModule, ToastModule, ConfirmDialogModule],
//   templateUrl: './course-list.html',
//   styleUrl: './course-list.css',
//   providers: [MessageService, ConfirmationService]

// })
// export class CourseList implements OnInit{
//   readonly courseService = inject(CourseService);
//   readonly messageService = inject(MessageService);
//   readonly confirmationService = inject(ConfirmationService);

//   courses = signal<Course[]>([]);

//   showAddForm = signal(false);
  
//   toggleAddForm(): void{
//     this.showAddForm.set(!this.showAddForm());
//   }

//   onCourseAdded(): void{
 
//     this.getCourses();
//   }

//   ngOnInit():void{
//     this.getCourses();
//   }

//   getCourses():void{
//     this.courseService.getAllCourses().subscribe({
//       next:(data)=> this.courses.set(data),
//       error:(err)=> console.error('Error fetching courses:',err)
//     });
//   }

//   deleteCourse(id:number):void{

 
//   this.confirmationService.confirm({
//     message: 'Are you sure you want to delete this course?',
//     header: 'Delete Course',
//     icon: 'pi pi-exclamation-triangle',

//     accept: () => {
//     this.courseService.deleteCourse(id).subscribe({
//       next:()=>{
//         // console.log("Course deleted");
//         this.messageService.add({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Course deleted successfully!',
//         life: 3000
//       });
//         this.getCourses();
//       },
//       error:(error)=>{
//         this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Failed to delete course.',
//         life: 3000
//       });
        
//       }
//     });
//   },



//   reject: () => {
//       // Nothing happens when user clicks Cancel
//     }
//   });}

// }






import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../course-service';
import { Course } from '../../../models/course.model';
import { AddCourse } from '../add-course/add-course';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, AddCourse, ButtonModule, TableModule, ToastModule, ConfirmDialogModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
  providers: [MessageService, ConfirmationService]
})
export class CourseList {
  readonly courseService = inject(CourseService);
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);

  courses = signal<Course[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  showAddForm = signal(false);

  
  first = signal(0);
  rows = signal(10);

  toggleAddForm(): void {
    this.showAddForm.set(!this.showAddForm());
  }

  onCourseAdded(): void {

    this.first.set(0);
    this.getCourses();
  }


  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.getCourses();
  }

  getCourses(): void {
    const page = Math.floor(this.first() / this.rows());
    this.loading.set(true);

    this.courseService.getCoursesPaged(page, this.rows()).subscribe({
      next: (res) => {
        this.courses.set(res.data.content);
        this.totalRecords.set(res.data.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.loading.set(false);
      }
    });
  }

  deleteCourse(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this course?',
      header: 'Delete Course',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.courseService.deleteCourse(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Course deleted successfully!',
              life: 3000
            });

            
            if (this.courses().length === 1 && this.first() > 0) {
              this.first.set(this.first() - this.rows());
            }
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