import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../course-service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList {
  readonly courseService = inject(CourseService);

  courses = signal<Course[]>([]);

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
