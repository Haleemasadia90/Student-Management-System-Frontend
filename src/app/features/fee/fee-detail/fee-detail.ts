import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FeeService } from '../fee-service';
import { StudentService } from '../../student/student-service';
import { Fee, FeeSummary } from '../../../models/fee.model';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-fee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-detail.html',
  styleUrl: './fee-detail.css',
})
export class FeeDetail implements OnInit {

  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly feeService = inject(FeeService);
  readonly studentService = inject(StudentService);

  student = signal<Student | null>(null);
  fees = signal<Fee[]>([]);
  summary = signal<FeeSummary | null>(null);
  studentId!: number;

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudent();
    this.loadFees();
    this.loadSummary();
  }

  loadStudent(): void {
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (data) => this.student.set(data),
      error: (err) => console.error('Error loading student:', err)
    });
  }

  loadFees(): void {
    this.feeService.getFeesByStudentId(this.studentId).subscribe({
      next: (data) => this.fees.set(data),
      error: (err) => console.error('Error loading fees:', err)
    });
  }


  loadSummary(): void{
    this.feeService.getStudentFeeSummary(this.studentId).subscribe({
      next:(data) => this.summary.set(data),
      error:(err) => console.error('Error loading fee summary:', err)
    });

  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}