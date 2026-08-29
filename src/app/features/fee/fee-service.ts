import { Injectable, inject } from '@angular/core';
import { ENDPOINTS } from '../../../environments/endpoints';
import { HttpClient } from '@angular/common/http';
import { Fee, FeeRequest } from '../../models/fee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  createFee(studentId:number, fee: FeeRequest){
    return this.http.post<Fee>(this.baseUrl+ENDPOINTS.fee.createFee.replace(':studentId',studentId.toString()),fee);
  }

  getFeesByStudentId(studentId:number){
    return this.http.get<Fee[]>(this.baseUrl+ENDPOINTS.fee.getFeesByStudentId.replace(':studentId',studentId.toString()));
  }

  getMyFees(){
    return this.http.get<Fee[]>(this.baseUrl+ENDPOINTS.fee.getMyFees);
  }

  updateFees(feeId:number,fee:FeeRequest){
    return this.http.put<Fee>(this.baseUrl+ENDPOINTS.fee.updateFee.replace(':feeId',feeId.toString()),fee);
  }

  deleteFee(feeId:number){
    return this.http.delete(this.baseUrl + ENDPOINTS.fee.deleteFee.replace(':feeId',feeId.toString()));
  }
}
