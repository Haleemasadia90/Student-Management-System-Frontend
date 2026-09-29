import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Course, CourseRequest } from '../../models/course.model';
import { ENDPOINTS } from '../../../environments/endpoints';
import { ApiResponse, PageResponse } from '../../models/Paginator';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  getAllCourses(departmentId?: number) {
    const url = departmentId
      ? `${this.baseUrl}${ENDPOINTS.courses.getAllCourses}?departmentId=${departmentId}`
      : this.baseUrl + ENDPOINTS.courses.getAllCourses;
    return this.http.get<Course[]>(url);
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

  getTotalCoursesCount() {
    return this.http.get<number>(this.baseUrl + ENDPOINTS.courses.getTotalCourses);
  }



  // paginatoir
  getCoursesPaged(page: number, size: number, sort = 'id,desc') {
  const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', sort);

  return this.http.get<ApiResponse<PageResponse<Course>>>(
    this.baseUrl + ENDPOINTS.courses.getCoursesPaged,
    { params }
  );
}
  
  
}
