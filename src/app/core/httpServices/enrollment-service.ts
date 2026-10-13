import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../../../environments/endpoints';
import { Enrollment } from '../../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;


  enrollStudent(
    studentId: number,
    courseId: number,
    semester: string
  ): Observable<Enrollment> {

    const params = new HttpParams()
      .set('studentId', studentId.toString())
      .set('courseId', courseId.toString())
      .set('semester', semester);

    return this.http.post<Enrollment>(
      `${this.baseUrl}${ENDPOINTS.enrollments.enrollStudent}`,
      null,
      { params }
    );
  }


  getStudentEnrollments(
    studentId: number
  ): Observable<Enrollment[]> {

    const url = ENDPOINTS.enrollments.getStudentEnrollments
      .replace(':studentId', studentId.toString());

    return this.http.get<Enrollment[]>(
      `${this.baseUrl}${url}`
    );
  }


  getStudentEnrollmentsBySemester(
    studentId: number,
    semester: string
  ): Observable<Enrollment[]> {

    const url = ENDPOINTS.enrollments.getStudentEnrollmentsBySemester
      .replace(':studentId', studentId.toString());

    const params = new HttpParams()
      .set('semester', semester);

    return this.http.get<Enrollment[]>(
      `${this.baseUrl}${url}`,
      { params }
    );
  }


  removeEnrollment(
    enrollmentId: number
  ): Observable<string> {

    const url = ENDPOINTS.enrollments.removeEnrollment
      .replace(':enrollmentId', enrollmentId.toString());

    return this.http.delete(
      `${this.baseUrl}${url}`,
      {
        responseType: 'text'
      }
    );
  }


  getSemesterCreditHours(
    studentId: number,
    semester: string
  ): Observable<number> {

    const url = ENDPOINTS.fee.getStudentCreditHours
      .replace(':studentId', studentId.toString());

    const params = new HttpParams()
      .set('semester', semester);

    return this.http.get<number>(
      `${this.baseUrl}${url}`,
      { params }
    );
  }


  getMyEnrollments(): Observable<Enrollment[]> {

    return this.http.get<Enrollment[]>(
      `${this.baseUrl}${ENDPOINTS.enrollments.getMyEnrollments}`
    );
  }


  getMyEnrollmentsBySemester(
    semester: string
  ): Observable<Enrollment[]> {

    const params = new HttpParams()
      .set('semester', semester);

    return this.http.get<Enrollment[]>(
      `${this.baseUrl}${ENDPOINTS.enrollments.getMyEnrollmentsBySemester}`,
      { params }
    );
  }


  enrollMyCourse(
    courseId: number,
    semester: string
  ): Observable<Enrollment> {

    const params = new HttpParams()
      .set('courseId', courseId.toString())
      .set('semester', semester);

    return this.http.post<Enrollment>(
      `${this.baseUrl}${ENDPOINTS.enrollments.enrollMyCourse}`,
      null,
      { params }
    );
  }


  removeMyEnrollment(
    enrollmentId: number
  ): Observable<string> {

    const url = ENDPOINTS.enrollments.removeMyEnrollment
      .replace(':enrollmentId', enrollmentId.toString());

    return this.http.delete(
      `${this.baseUrl}${url}`,
      {
        responseType: 'text'
      }
    );
  }

}