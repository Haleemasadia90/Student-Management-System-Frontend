import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../student/student-service';
import { CommonModule } from '@angular/common';
import {CourseService} from '../../courses/course-service';
import { FeeSummary } from '../../../models/fee.model';
import { FeeService } from '../../fee/fee-service';

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
 readonly courseService = inject(CourseService);
 readonly feeService = inject(FeeService);

  myRecord = signal<Student | null>(null);
   availableCoursesCount = signal<number>(0);
   summary = signal<FeeSummary | null>(null);


    get pieChartStyle(): string {

    const s = this.summary();
    if (!s) return '';
const paidDeg = (s.paidPercentage / 100) * 360;
    return `conic-gradient(#16a34a 0deg ${paidDeg}deg, #dc2626 ${paidDeg}deg 360deg)`;
  }
    

   
  get username(): string | null {
    return this.authService.getUsername();
  }

  get enrolledCoursesCount(): number {
    return this.myRecord()?.courseTitles?.length ?? 0;
  }

  ngOnInit(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => {
        this.myRecord.set(data);

        if (data.departmentId) {
          this.loadAvailableCourses(data.departmentId);
        }
      },
      error: (err) => console.error('Error fetching record:', err)
    });

     this.feeService.getMyFeeSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error('Error fetching fee summary:', err)
    });
  }

   loadAvailableCourses(departmentId: number): void {
    this.courseService.getAllCourses(departmentId).subscribe({
      next: (courses) => this.availableCoursesCount.set(courses.length),
      error: (err) => console.error('Error fetching courses:', err)
    });
  }

 
}