import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentList } from './features/student/student-list/student-list';
import { Login } from './features/auth/login/login';
import { Registration } from './features/auth/registration/registration';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('student-management-system');
}
