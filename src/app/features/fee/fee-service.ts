import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENDPOINTS } from '../../../environments/endpoints';
import { Fee, FeeRequest, FeeSummary } from '../../models/fee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllFees() {
    return this.http.get<Fee[]>(
      `${this.baseUrl}${ENDPOINTS.fee.getAllFees}`
    );
  }

  createFee(studentId: number, fee: FeeRequest) {
    const url = ENDPOINTS.fee.createFee.replace(
      ':studentId',
      studentId.toString()
    );

    return this.http.post<Fee>(`${this.baseUrl}${url}`, fee);
  }

  getFeesByStudentId(studentId: number) {
    const url = ENDPOINTS.fee.getFeesByStudentId.replace(
      ':studentId',
      studentId.toString()
    );

    return this.http.get<Fee[]>(`${this.baseUrl}${url}`);
  }

  getMyFees() {
    return this.http.get<Fee[]>(
      `${this.baseUrl}${ENDPOINTS.fee.getMyFees}`
    );
  }

  updateFees(feeId: number, fee: FeeRequest) {
    const url = ENDPOINTS.fee.updateFee.replace(
      ':feeId',
      feeId.toString()
    );

    return this.http.put<Fee>(`${this.baseUrl}${url}`, fee);
  }

  deleteFee(feeId: number) {
    const url = ENDPOINTS.fee.deleteFee.replace(
      ':feeId',
      feeId.toString()
    );

    return this.http.delete(`${this.baseUrl}${url}`);
  }

  // Credit hours for the selected semester
  getStudentCreditHours(studentId: number, semester: string) {
    const url = ENDPOINTS.fee.getStudentCreditHours.replace(
      ':studentId',
      studentId.toString()
    );

    const params = new HttpParams().set('semester', semester);

    return this.http.get<number>(
      `${this.baseUrl}${url}`,
      { params }
    );
  }

  calculateStudentFee(studentId: number) {
    const url = ENDPOINTS.fee.calculateStudentFee.replace(
      ':studentId',
      studentId.toString()
    );

    return this.http.get<number>(`${this.baseUrl}${url}`);
  }

  getMyFeeSummary() {
    return this.http.get<FeeSummary>(
      `${this.baseUrl}${ENDPOINTS.fee.getMyFeeSummary}`
    );
  }

  getStudentFeeSummary(studentId: number) {
    const url = ENDPOINTS.fee.getFeeSummaryByStudentId.replace(
      ':studentId',
      studentId.toString()
    );

    return this.http.get<FeeSummary>(`${this.baseUrl}${url}`);
  }

  getAvailableSemesters(studentId: number) {
    const url = ENDPOINTS.fee.getAvailableSemesters.replace(
      ':studentId',
      studentId.toString()
    );

    return this.http.get<string[]>(`${this.baseUrl}${url}`);
  }

  getOverallFeeSummary() {
    return this.http.get<FeeSummary>(
      `${this.baseUrl}${ENDPOINTS.fee.getOverallFeeSummary}`
    );
  }

  getMyFeesBySemester(semester: string) {
  const params = new HttpParams().set('semester', semester);

  return this.http.get<Fee[]>(
    `${this.baseUrl}/api/fee/me/semester`,
    { params }
  );
}

getMyAvailableSemesters() {
  return this.http.get<string[]>(
    `${this.baseUrl}/api/fee/me/semesters`
  );
}

getMyFeeSummaryBySemester(semester: string) {
  const params = new HttpParams().set('semester', semester);

  return this.http.get<FeeSummary>(
    `${this.baseUrl}/api/fee/me/summary`,
    { params }
  );
}
}
