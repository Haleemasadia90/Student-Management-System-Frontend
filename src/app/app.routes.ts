import { Routes } from '@angular/router';
import { StudentList } from './features/student/student-list/student-list';

import { Login } from './features/auth/login/login';
import { Registration } from './features/auth/registration/registration';
import { authGuard } from './core/guard/auth-guard';
import { authRole } from './core/guard/auth-role';
import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { StudentDashboard } from './features/dashboard/student-dashboard/student-dashboard';



export const routes: Routes = [
    // { path: '', component: StudentList },
    // { path: 'add', component: Add },
    // { path: 'edit/:id', component: Add }
     { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path:'login', component:Login},
    {path:'registration', component:Registration},
    // { path: 'test-students', component: StudentList },
    {path:'admin/dashboard',component:AdminDashboard,canActivate:[authGuard,authRole('ADMIN')]},
    {path:'student/dashboard',component:StudentDashboard,canActivate:[authGuard,authRole('STUDENT')]}
//     {
//     path: 'admin',
//     canActivate: [authGuard, authRole('ADMIN')],   // ← dono guards yahan lag rahe
//     children: [
//       { path: 'dashboard' },
//     ]
//   },
//   {
//     path: 'student',
//     canActivate: [authGuard, authRole('STUDENT')],
//     children: [
//       { path: 'dashboard'},
//     ]
//   },
];
