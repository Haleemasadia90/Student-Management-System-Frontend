
import {HttpClient} from "@angular/common/http";
import { Student } from '../../models/student.model';
import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../../../environments/endpoints';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  baseUrl=environment.apiUrl;
readonly http=inject(HttpClient);

getAllStudents() {
  return this.http.get<Student[]>(this.baseUrl+ENDPOINTS.students.getAllStudents);
}

// createStudents(student: Student){
//   return this.http.post<Student>(this.baseUrl+ENDPOINTS.students.createStudents, student);
// }

// updateStudent(id: number, student: Student){
//   return this.http.put<Student>(this.baseUrl+ENDPOINTS.students.updateStudent.replace(':id', id.toString()), student);
// }

searchStudentsByName(name: string) {
  return this.http.get<Student[]>(
    this.baseUrl + ENDPOINTS.students.searchByName,
    { params: { name } }
  );
}


getStudentById(id:number){
  return this.http.get<Student>(this.baseUrl+ENDPOINTS.students.getStudentById.replace(':id',id.toString()));
}

deleteStudent(id: number){
  return this.http.delete(this.baseUrl+ENDPOINTS.students.deleteStudent.replace(':id', id.toString()));
}

 getMyRecord() {
  return this.http.get<Student>(this.baseUrl + ENDPOINTS.students.getMyRecord);
 }

enrollInCourse(courseId: number) {
  return this.http.post<Student>(this.baseUrl + '/api/students/enroll', { courseId });
}




 profileUpdated = signal(0);   

  notifyProfileUpdated(): void {
    this.profileUpdated.update(v => v + 1);
  }

  uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.baseUrl + ENDPOINTS.students.uploadPhoto, formData, { responseType: 'text' });
  }
}