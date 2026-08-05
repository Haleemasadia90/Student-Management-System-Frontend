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

createStudents(student: Student){
  return this.http.post<Student>('http://localhost:8080/api/students', student);
}

updateStudent(id: number, student: Student){
  return this.http.put<Student>('http://localhost:8080/api/students/'+id, student);
}


deleteStudent(id: number){
  return this.http.delete('http://localhost:8080/api/students/'+id);
}


getStudentById(id: number){
  return this.http.get<Student>('http://localhost:8080/api/students/'+id);
}








}