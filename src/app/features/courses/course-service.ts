import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Course, CourseRequest } from '../../models/course.model';
import { ENDPOINTS } from '../../../environments/endpoints';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  getAllCourses()
  {
    return this.http.get<Course[]>(this.baseUrl + ENDPOINTS.courses.getAllCourses);
  }

  getCourseById(id: number)
  {
    return this.http.get<Course>(this.baseUrl+ENDPOINTS.courses.getCourseById.replace(':id', id.toString()));
  }

  createCourse(course:CourseRequest)
  {
    return this.http.post<Course>(this.baseUrl+ENDPOINTS.courses.createCourse,course);
  }

  updateCourse(id:number,course:CourseRequest){
    return this.http.put<Course>(this.baseUrl+ENDPOINTS.courses.updateCourse.replace(':id',id.toString()),course);
  }

  deleteCourse(id:number){
    return this.http.delete(this.baseUrl+ENDPOINTS.courses.deleteCourse.replace(':id',id.toString()));
  }
}
