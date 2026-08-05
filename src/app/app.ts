import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentList } from './components/student/student-list/student-list';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StudentList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('student-management-system');
}
