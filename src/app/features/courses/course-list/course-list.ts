import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../course-service';
import { Course } from '../../../models/course.model';
import { AddCourse } from '../add-course/add-course';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule,AddCourse],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit{
  readonly courseService = inject(CourseService);

  courses = signal<Course[]>([]);

  showAddForm = false;
  
  toggleAddForm(): void{
    this.showAddForm = !this.showAddForm;
  }

  onCourseAdded(): void{
    this.showAddForm = false;
    this.getCourses();
  }

  ngOnInit():void{
    this.getCourses();
  }

  getCourses():void{
    this.courseService.getAllCourses().subscribe({
      next:(data)=> this.courses.set(data),
      error:(err)=> console.error('Error fetching courses:',err)
    });
  }

  deleteCourse(id:number):void{

     const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    this.courseService.deleteCourse(id).subscribe({
      next:()=>{
        console.log("Course deleted");
        this.getCourses();
      },
      error:(error)=>{
        console.error('Error deleting course:',error);
      }
    });
  }

}
