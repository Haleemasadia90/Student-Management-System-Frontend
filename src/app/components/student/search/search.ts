// import { Component, EventEmitter, inject, Output } from '@angular/core';
// import { Student } from '../../../models/student.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { StudentService } from '../student-service';

// @Component({
//   selector: 'app-search',
//     standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './search.html',
//   styleUrl: './search.css',
// })
// export class Search {
// @Output() studentFound = new EventEmitter<Student | null>();

//   readonly studentService=inject(StudentService);
//   searchId!:number;
//   searched:Student|null=null;



// getStudentById(): void {

//   this.studentService.getStudentById(this.searchId).subscribe({

//     next: (data) => {
//       this.searched = data;
//       this.studentFound.emit(data);
//     },

//     error: () => {
//       this.searched = null;
//       this.studentFound.emit(null);
//       alert("Student not found");
//     }

//   });




// }










// }