import { Component, inject, effect } from '@angular/core';
import { Layout } from '../../../shared/layout/layout';
import { AuthService } from '../../../core/httpServices/auth-service';
import { StudentService } from '../../student/student-service';
import { NavItem } from '../../../models/nav-item.model';
import { signal } from '@angular/core';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [Layout],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {
  readonly authService = inject(AuthService);
  readonly studentService = inject(StudentService);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'ti ti-layout-dashboard', route: '/student/dashboard' },
    { label: 'My Courses', icon: 'ti ti-book', route: '/student/courses' },
    { label: 'My Fee', icon: 'ti ti-cash', route: '/student/fee' },
    { label: 'Settings', icon: 'ti ti-settings', route: '/student/settings' },
  ];

  username: string | null = this.authService.getUsername();
  profilePicture = signal<string | null>(null);

  logoutFn = () => this.authService.logout();

  constructor() {
    
    effect(() => {
      this.studentService.profileUpdated();   
      this.loadProfile();
    });
  }

  loadProfile(): void {
    this.studentService.getMyRecord().subscribe({
      next: (data) => this.profilePicture.set(data.profilePicture ?? null),
      error: (err) => console.error('Error loading profile picture:', err)
    });
  }
}