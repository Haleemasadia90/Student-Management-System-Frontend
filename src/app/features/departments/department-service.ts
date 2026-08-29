import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Department, DepartmentRequest } from '../../models/department.model';
import { ENDPOINTS } from '../../../environments/endpoints';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  getAllDepartments(){
    return this.http.get<Department[]>(this.baseUrl + ENDPOINTS.department.getAllDepartments);
  }

  createDepartment(dept:DepartmentRequest){
    return this.http.post<Department>(this.baseUrl + ENDPOINTS.department.createDepartment,dept);
  }

  deleteDepartment(id:number)
  {
    return this.http.delete(this.baseUrl + ENDPOINTS.department.deleteDepartments.replace(':id',id.toString()));
  }
}
