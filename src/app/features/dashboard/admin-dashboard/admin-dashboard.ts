import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { StudentList } from "../../student/student-list/student-list";
import { CourseList } from '../../courses/course-list/course-list';

@Component({
  selector: 'app-admin-dashboard',
  imports: [StudentList,CourseList],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  readonly authService = inject(AuthService);

  get username(): string | null {
  return this.authService.getUsername();
}


  logout(): void{
    this.authService.logout();
  }
}
