import { Component, inject, OnInit, signal } from '@angular/core';
import { Student } from '../../../models/student.model';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student-service';
import { FeeManager } from '../../fee/fee-manager/fee-manager';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FeeManager],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {

  readonly studentService = inject(StudentService);


  students = signal<Student[]>([]);
  expandedStudentId = signal<number | null>(null);

  

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
      

        this.students.set([...data]);
      },
      error: (err) => console.error(err)
    });
  }

 

  toggleFeeManager(id:number):void{
    this.expandedStudentId.set(this.expandedStudentId() === id ? null : id);
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


}