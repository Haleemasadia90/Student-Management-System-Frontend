

import { Component, inject, OnInit, signal } from '@angular/core';
import { Student } from '../../../models/student.model';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student-service';
import { Add } from './add-student/add';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, Add, FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {

  readonly studentService = inject(StudentService);


  students = signal<Student[]>([]);

  isEditMode = false;
  showAddForm = false;

  selectedStudent!: Student;

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        console.log("Data:", data);
        console.log("Is Array:", Array.isArray(data));
        console.log("Length:", data.length);

        this.students.set([...data]);
      },
      error: (err) => console.error(err)
    });
  }

  openAddForm(): void {
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
  }

  openEditForm(student: Student): void {
    this.selectedStudent = student;
    this.isEditMode = true;
    this.showAddForm = true;
  }

  deleteStudent(id: number): void {
    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        console.log("student deleted");
        this.getStudents();
      },
      error: (error) => {
        console.error('Error deleting student:', error);
      }
    });
  }

  searchId!: number;

  searchStudent(): void {
    this.studentService.getStudentById(this.searchId).subscribe({
      next: (data) => {
        this.students.set([data]);
      },
      error: () => {
        alert("Student not found");
        this.students.set([]);
      }
    });
  }

  createStudents(student: Student): void {
    if (this.isEditMode) {
      this.studentService.updateStudent(student.studentID, student).subscribe({
        next: (data) => {
          console.log(data);
          this.getStudents();
          this.closeAddForm();
          this.isEditMode = false;
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    } else {
      this.studentService.createStudents(student).subscribe({
        next: (data) => {
          console.log(data);
          this.getStudents();
          this.closeAddForm();
        },
        error: (error) => {
          console.error('Error creating student:', error);
        }
      });
    }
  }

}