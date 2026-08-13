import { TrailingSlashPathLocationStrategy } from "@angular/common";

export interface LoginRequest{
    email:string;
    password:string;
}

export interface SignupRequest{
    username:string;
    email:string;
    password:string;
}

export interface LoginResponse{
    token:string;
    username:string;
    email:string;
    role:string;
}