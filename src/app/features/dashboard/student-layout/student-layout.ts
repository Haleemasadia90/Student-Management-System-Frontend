import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/httpServices/auth-service';
import { NavItem } from '../../../models/nav-item.model';
import { Layout } from '../../../shared/layout/layout';

@Component({
  selector: 'app-student-layout',
  imports: [Layout],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {
  

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'ti ti-layout-dashboard', route: '/student/dashboard' },
    { label: 'My Courses', icon: 'ti ti-book', route: '/student/courses' },
    { label: 'My Fee', icon: 'ti ti-cash', route: '/student/fee' },
    { label: 'Settings', icon: 'ti ti-settings', route: '/student/settings' },
  ];
 username: string | null = null;


  constructor(
    private authService: AuthService
  ) {

    this.username =
      this.authService.getUsername();

  }

  logoutFn = () => this.authService.logout();
}
