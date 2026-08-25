import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FeeService } from '../fee-service';
import { Fee } from '../../models/fee.model';
import { FormGroup,FormControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeeRequest } from '../../models/fee.model';

@Component({
  selector: 'app-fee-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fee-manager.html',
  styleUrl: './fee-manager.css',
})
export class FeeManager implements OnInit {
  readonly feeService = inject(FeeService);

  @Input({required:true}) studentId!:number;

  fees = signal<Fee[]>([]);
  showAddForm = false;
  editingFeeId: number | null = null;

   feeForm = new FormGroup({
    semester: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    totalFee: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    paidFee: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    status: new FormControl('PENDING', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit():void{
    this.loadFees();
  }

  loadFees():void{
    this.feeService.getFeesByStudentId(this.studentId).subscribe({
      next:(data)=> this.fees.set(data),
      error:(err)=>console.error('Error loading fees:',err)

    });
  }

  openAddForm():void{
   this.editingFeeId = null;
    this.feeForm.reset({ totalFee: 0, paidFee: 0, status: 'PENDING' });
    this.showAddForm = true;
  }

  openEditForm(fee: Fee): void {
    this.editingFeeId = fee.id;
    this.feeForm.setValue({
      semester: fee.semester,
      totalFee: fee.totalFee,
      paidFee: fee.paidFee,
      status: fee.status,
    });
    this.showAddForm = true;
  }


  closeForm(): void {
    this.showAddForm = false;
    this.editingFeeId = null;
  }

    save(): void {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    const feeData: FeeRequest = this.feeForm.getRawValue();

    if (this.editingFeeId) {
      this.feeService.updateFees(this.editingFeeId, feeData).subscribe({
        next: () => {
          
          this.closeForm();
          this.loadFees();
        },
        error: (err) => console.error('Error updating fee:', err)
      });
    } else {
      this.feeService.createFee(this.studentId, feeData).subscribe({
        next: () => {
          this.closeForm();
          this.loadFees();
        },
        error: (err) => console.error('Error creating fee:', err)
      });
    }
  }

  deleteFee(feeId: number): void {
    const confirmDelete = confirm("Delete this fee record?");
    if (!confirmDelete) return;

    this.feeService.deleteFee(feeId).subscribe({
      next: () => this.loadFees(),
      error: (err) => console.error('Error deleting fee:', err)
    });
  }
}
