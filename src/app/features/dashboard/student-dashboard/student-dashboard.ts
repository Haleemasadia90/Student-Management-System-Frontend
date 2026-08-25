import { Component,inject, OnInit , signal } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { Router } from '@angular/router';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../student/student-service';
import { CommonModule } from '@angular/common';
import { FeeService } from '../../../fee/fee-service';
import { Fee } from '../../../models/fee.model';

@Component({
  selector: 'app-student-dashboard',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  readonly studentService = inject(StudentService);
  readonly authService = inject(AuthService);
  readonly feeService = inject(FeeService);
  readonly router = inject(Router);

  myRecord = signal<Student | null>(null);
  myFees = signal<Fee[]>([]);

   get username(): string | null {
  return this.authService.getUsername();
}

ngOnInit(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => this.myRecord.set(data),
      error: (err) => console.error('Error fetching record:', err)
    });

    this.feeService.getMyFees().subscribe(
      {
        next:(data)=>this.myFees.set(data),
        error:(err)=>console.error('Error fetching fees:',err)
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }

}
