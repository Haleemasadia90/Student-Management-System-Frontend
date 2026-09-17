export interface Fee {
  id: number;
  studentId:number;
  studentUsername: string;
  semester: string;
  totalFee: number;
  paidFee: number;
  dueAmount: number;
  status: string;
}

export interface FeeRequest {
  semester: string;
  totalFee: number;
  paidFee: number;
  status: string;
}

export interface FeeSummary {
  totalPaid: number;
  totalDue: number;
  totalOverall: number;
  paidPercentage: number;
}