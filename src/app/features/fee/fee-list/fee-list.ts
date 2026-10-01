import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { StudentService } from '../../student/student-service';
import { Student } from '../../../models/student.model';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-fee-list',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    PaginatorModule
  ],

  templateUrl: './fee-list.html',
  styleUrl: './fee-list.css',
})
export class FeeList implements OnInit, OnDestroy {

  readonly studentService = inject(StudentService);
  readonly router = inject(Router);

  students = signal<Student[]>([]);
  searchName = '';

  // Pagination
  currentPage = signal(0);
  pageSize = signal(10);
  totalRecords = signal(0);

  private searchSubject = new Subject<string>();


  ngOnInit(): void {

    this.getStudents();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),

      switchMap((name: string) => {

        if (!name || !name.trim()) {

          return this.studentService.getStudentsPaged(
            this.currentPage(),
            this.pageSize()
          );

        }

        return this.studentService.searchStudentsByName(name);
      })

    ).subscribe({

      next: (data: any) => {

        // Search result
        if (Array.isArray(data)) {

          this.students.set(data);

          this.totalRecords.set(data.length);

        }

        // Paginated result
        else {

          this.students.set(data.data.content);

          this.totalRecords.set(data.data.totalElements);

        }

      },

      error: (err) => {

        console.error('Error searching student:', err);

        this.students.set([]);

        this.totalRecords.set(0);

      }

    });
  }


  onSearchChange(value: string): void {

    this.searchSubject.next(value);

  }


  getStudents(): void {

    this.studentService.getStudentsPaged(
      this.currentPage(),
      this.pageSize()
    ).subscribe({

      next: (response) => {

        this.students.set(response.data.content);

        this.totalRecords.set(response.data.totalElements);

      },

      error: (err) => {

        console.error('Error loading students:', err);

        this.students.set([]);

        this.totalRecords.set(0);

      }

    });

  }


  onPageChange(event: any): void {

    this.currentPage.set(event.page);

    this.pageSize.set(event.rows);

    this.getStudents();

  }


  viewFeeDetail(studentId: number): void {

    this.router.navigate(['/admin/finance', studentId]);

  }


  ngOnDestroy(): void {

    this.searchSubject.complete();

  }

}