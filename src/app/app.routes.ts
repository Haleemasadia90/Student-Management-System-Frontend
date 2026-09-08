import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Registration } from './features/auth/registration/registration';

import { authGuard } from './core/guard/auth-guard';
import { authRole } from './core/guard/auth-role';

import { AdminLayout } from './features/dashboard/admin-layout/admin-layout';

import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { StudentDashboard } from './features/dashboard/student-dashboard/student-dashboard';

import { StudentList } from './features/student/student-list/student-list';
import { CourseList } from './features/courses/course-list/course-list';
import { FeeList } from './features/fee/fee-list/fee-list';
import { DepartmentManager } from './features/departments/department-manager/department-manager';
import { StudentLayout } from './features/dashboard/student-layout/student-layout';
import { FeeDetail } from './features/fee/fee-detail/fee-detail'; 
import { MyFee } from './features/fee/my-fee/my-fee';
import { MyCourses } from './features/courses/my-courses/my-courses';
import { ChangePassword } from './features/auth/change-password/change-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { Settings } from './features/settings/settings';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'registration',
    component: Registration
  },

  { path: 'forgot-password', component: ForgotPassword },
{ path: 'reset-password', component: ResetPassword }, 



  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, authRole('ADMIN')],
    children: [

      {
        path: 'dashboard',
        component: AdminDashboard
      },

      {
        path: 'students',
        component: StudentList
      },

      {
        path: 'courses',
        component: CourseList
      },

      {
        path: 'finance',
        component: FeeList
      },

       { path: 'finance/:id', component: FeeDetail },

      {
  path: 'departments',
  component: DepartmentManager
},

    ]
  },



  {
  path: 'student',
  component: StudentLayout,         
  canActivate: [authGuard, authRole('STUDENT')],
  children: [
    { path: 'dashboard', component: StudentDashboard },
    { path: 'courses', component: MyCourses },  
    { path: 'fee', component: MyFee },             
    { path: 'settings', component: Settings },
  ]
},

];