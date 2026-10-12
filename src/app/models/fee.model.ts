export interface Fee {
  id: number;
  studentId:number;
  studentUsername: string;
  semester: string;
  ratePerCreditHour: number;
  fixedSemesterCharge: number;
  totalFee: number;
  paidFee: number;
  dueAmount: number;
  status: string;
}

export interface FeeRequest {
  semester: string;
   ratePerCreditHour: number;
  fixedSemesterCharge: number;
 
  paidFee: number;
 
}

export interface FeeSummary {
  totalPaid: number;
  totalDue: number;
  totalOverall: number;
  paidPercentage: number;
}