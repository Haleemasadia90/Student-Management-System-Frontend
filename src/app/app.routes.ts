// import { Routes } from '@angular/router';
// import { StudentList } from './features/student/student-list/student-list';

// import { Login } from './features/auth/login/login';
// import { Registration } from './features/auth/registration/registration';
// import { authGuard } from './core/guard/auth-guard';
// import { authRole } from './core/guard/auth-role';
// import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
// import { StudentDashboard } from './features/dashboard/student-dashboard/student-dashboard';



// export const routes: Routes = [
//     // { path: '', component: StudentList },
//     // { path: 'add', component: Add },
//     // { path: 'edit/:id', component: Add }
//      { path: '', redirectTo: 'login', pathMatch: 'full' },
//     { path:'login', component:Login},
//     {path:'registration', component:Registration},
//     // { path: 'test-students', component: StudentList },
//     {path:'admin/dashboard',component:AdminDashboard,canActivate:[authGuard,authRole('ADMIN')]},
//     {path:'student/dashboard',component:StudentDashboard,canActivate:[authGuard,authRole('STUDENT')]}
// //     {
// //     path: 'admin',
// //     canActivate: [authGuard, authRole('ADMIN')],   // ← dono guards yahan lag rahe
// //     children: [
// //       { path: 'dashboard' },
// //     ]
// //   },
// //   {
// //     path: 'student',
// //     canActivate: [authGuard, authRole('STUDENT')],
// //     children: [
// //       { path: 'dashboard'},
// //     ]
// //   },
// ];




import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Registration } from './features/auth/registration/registration';

import { authGuard } from './core/guard/auth-guard';
import { authRole } from './core/guard/auth-role';

import { AdminLayout } from './shared/admin-layout/admin-layout';

import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { StudentDashboard } from './features/dashboard/student-dashboard/student-dashboard';

import { StudentList } from './features/student/student-list/student-list';
import { CourseList } from './features/courses/course-list/course-list';
import { FeeList } from './fee/fee-list/fee-list';

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

  // =========================
  // ADMIN ROUTES
  // =========================

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
      }

    ]
  },

  // =========================
  // STUDENT ROUTES
  // =========================

  {
    path: 'student/dashboard',
    component: StudentDashboard,
    canActivate: [authGuard, authRole('STUDENT')]
  }

];