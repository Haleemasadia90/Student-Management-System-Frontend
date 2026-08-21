// import { Component, EventEmitter, Output,inject, OnInit, Input } from '@angular/core';
// import { Student } from '../../../../models/student.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { StudentService } from '../../student-service';

// @Component({
//   selector: 'app-add',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './add.html',
//   styleUrl: './add.css',
// })
// export class Add implements OnInit {
//   readonly studentService=inject(StudentService);

//     @Output() close = new EventEmitter<void>();
//     @Output() studentAdded = new EventEmitter<void>();
//     @Input() student!: Student;
//     @Output() addStudent= new EventEmitter<Student>();

// @Input() isEditMode = false;

    
//   newStudent:Student={
//     studentID: 0,
//     fname: '',
//     email: ''
//   }


// closeForm():void{
//  this.close.emit();
// }









// ngOnInit():void{
//   if(this.isEditMode ){
//     this.newStudent = { ...this.student };
//   }
// }




// saveStudent():void{

//  console.log('New Student:', this.newStudent);
//     this.addStudent.emit(this.newStudent);
//     this.closeForm();
// }




// }
