 
export interface LoginRequest{
    email:string;
    password:string;
}

export interface SignupRequest{
    username:string;
    email:string;
    password:string;
     fullName: string;
  phone: string;
  departmentId: number;
  dateOfBirth: string;
  gender: string;
  semester: string;
  admissionYear: number;
}

export interface LoginResponse{
    token:string;
     refreshToken: string; 
    username:string;
    email:string;
    role:string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
    email: string;
  otp: string;
  newPassword: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}