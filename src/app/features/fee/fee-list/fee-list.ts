import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { StudentService } from '../../student/student-service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-fee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-list.html',
  styleUrl: './fee-list.css',
})
export class FeeList implements OnInit, OnDestroy {

  readonly studentService = inject(StudentService);
  readonly router = inject(Router);

  students = signal<Student[]>([]);
  searchName: string = '';


  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.getStudents();

   
    this.searchSubject.pipe(
      debounceTime(300),        
      distinctUntilChanged(),     
      switchMap((name: string) => {
        if (!name || !name.trim()) {
        
          return this.studentService.getAllStudents();
        }
        return this.studentService.searchStudentsByName(name);
      })
    ).subscribe({
      next: (data: Student[]) => this.students.set(data),
      error: (err) => {
        console.error('Error searching student:', err);
        this.students.set([]);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  getStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => this.students.set(data),
      error: (err) => console.error('Error loading students:', err)
    });
  }

  viewFeeDetail(studentId: number): void {
    this.router.navigate(['/admin/finance', studentId]);
  }

  ngOnDestroy(): void {
  
    this.searchSubject.complete();
  }
}