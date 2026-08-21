import { inject, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Student } from '../../models/student.model';
import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../../../environments/endpoints';

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

getStudentById(id:number){
  return this.http.get<Student>(this.baseUrl+ENDPOINTS.students.getStudentById.replace(':id',id.toString()));
}

deleteStudent(id: number){
  return this.http.delete(this.baseUrl+ENDPOINTS.students.deleteStudent.replace(':id', id.toString()));
}

 getMyRecord() {
  return this.http.get<Student>(this.baseUrl + ENDPOINTS.students.getMyRecord);
 }


}