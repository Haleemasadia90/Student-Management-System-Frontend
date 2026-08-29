import { Component } from '@angular/core';
import { Layout } from '../../../shared/layout/layout';
import { NavItem } from '../../../models/nav-item.model';
import { AuthService } from '../../../core/httpServices/auth-service';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [Layout],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

  
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'ti ti-dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Students',
      icon: 'ti ti-users',
      route: '/admin/students'
    },
    {
      label: 'Courses',
      icon: 'ti ti-book',
      route: '/admin/courses'
    },
    {
      label: 'Finance',
      icon: 'ti ti-wallet',
      route: '/admin/finance'
    },

    {
 label: 'Settings',
icon: 'ti ti-settings',

  route: '/admin/departments'
},
  ];

  username: string | null = null;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
  }
}