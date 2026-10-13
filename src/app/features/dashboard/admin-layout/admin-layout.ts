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
      icon: 'pi pi-home',
      route: '/admin/dashboard'
    },

    {
      label: 'Students',
      icon: 'pi pi-users',
      route: '/admin/students'
    },

    {
      label: 'Courses',
      icon: 'pi pi-book',
      route: '/admin/courses'
    },

    {
      label: 'Finance',
      icon: 'pi pi-wallet',
      route: '/admin/finance'
    },

    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/admin/departments'
    }

  ];




  username: string | null = null;



  constructor(
    private authService: AuthService
  ) {

    this.username = this.authService.getUsername();

  }




  logout(): void {

    this.authService.logout();

  }

}