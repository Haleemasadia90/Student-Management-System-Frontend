export interface Fee {
  id: number;
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