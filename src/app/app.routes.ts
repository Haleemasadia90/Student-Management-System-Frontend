import { Routes } from '@angular/router';
import { StudentList } from './features/student/student-list/student-list';
import { Add } from './features/student/student-list/add-student/add';
import { Login } from './features/auth/login/login';
import { Registration } from './features/auth/registration/registration';
import { authGuard } from './core/guard/auth-guard';
import { authRole } from './core/guard/auth-role';



export const routes: Routes = [
    // { path: '', component: StudentList },
    // { path: 'add', component: Add },
    // { path: 'edit/:id', component: Add }
     { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path:'login', component:Login},
    {path:'registration', component:Registration},
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
