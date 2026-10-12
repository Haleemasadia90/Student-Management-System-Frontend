
import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { FeeService } from '../fee-service';
import { Fee, FeeRequest } from '../../../models/fee.model';

/* PrimeNG */
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import {
  MessageService,
  ConfirmationService
} from 'primeng/api';

@Component({
  selector: 'app-fee-manager',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],

  templateUrl: './fee-manager.html',
  styleUrl: './fee-manager.css',

  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class FeeManager implements OnInit, OnDestroy {

  readonly feeService = inject(FeeService);
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);

  @Input({ required: true })
  studentId!: number;

  @Input({ required: true })
  admissionYear!: number;

  fees = signal<Fee[]>([]);
  availableSemesters = signal<string[]>([]);
 
dialogSemesters = signal<string[]>([]);      

  showAddForm = false;
  editingFeeId: number | null = null;

  enrolledCreditHours = 0;
  calculatedTotalFee = 0;

  totalFeeValue = signal(0);
  paidFeeValue = signal(0);

  private subscriptions = new Subscription();
  private creditHoursRequestId = 0;

  feeForm = new FormGroup({
    semester: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    ratePerCreditHour: new FormControl(5000, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0)
      ]
    }),

    fixedSemesterCharge: new FormControl(15000, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0)
      ]
    }),

    paidFee: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0)
      ]
    })
  });

  computedStatus = computed(() =>
    this.previewStatus(
      this.totalFeeValue(),
      this.paidFeeValue()
    )
  );

  ngOnInit(): void {
    this.loadFees();
    this.loadAvailableSemesters();

    this.subscriptions.add(
      this.feeForm.controls.semester.valueChanges.subscribe(
        semester => {
          if (semester) {
            this.loadStudentCreditHours(semester);
          } else {
            this.creditHoursRequestId++;
            this.enrolledCreditHours = 0;
            this.calculateTotalFee();
          }
        }
      )
    );

    this.subscriptions.add(
      this.feeForm.controls.paidFee.valueChanges.subscribe(
        value => {
          this.paidFeeValue.set(value ?? 0);
        }
      )
    );

    this.subscriptions.add(
      this.feeForm.controls.ratePerCreditHour.valueChanges.subscribe(
        () => this.calculateTotalFee()
      )
    );

    this.subscriptions.add(
      this.feeForm.controls.fixedSemesterCharge.valueChanges.subscribe(
        () => this.calculateTotalFee()
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.creditHoursRequestId++;
  }


    /** Called by the parent after enrollments change. */
  refresh(): void {
    this.loadFees();
    this.loadAvailableSemesters();
  }

  // Load all fee records for this student
  loadFees(): void {
    this.feeService.getFeesByStudentId(this.studentId).subscribe({
      next: data => {
        this.fees.set(data ?? []);
      },
      error: err => {
        console.error('Error loading fees:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load fee records.'
        });
      }
    });
  }

  // Load semesters that have enrollments but no fee record
 loadAvailableSemesters(): void {
  this.feeService.getAvailableSemesters(this.studentId).subscribe({
    next: data => {
      const semesters = data ?? [];
      this.availableSemesters.set(semesters);

      // sirf Add mode mein dialog options update karein
      if (this.showAddForm && this.editingFeeId === null) {
        this.dialogSemesters.set(semesters);

        if (!this.feeForm.controls.semester.value && semesters.length > 0) {
          this.feeForm.controls.semester.setValue(semesters[0]);
        }
      }
    },
    error: err => {
      console.error('Error loading available semesters:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to load available semesters.'
      });
    }
  });
}
  // Fetch credit hours for the selected semester
  loadStudentCreditHours(semester: string): void {
    if (!semester) {
      this.creditHoursRequestId++;
      this.enrolledCreditHours = 0;
      this.calculateTotalFee();
      return;
    }

    const requestId = ++this.creditHoursRequestId;

    this.feeService
      .getStudentCreditHours(this.studentId, semester)
      .subscribe({
        next: creditHours => {
          // Ignore an older response if the semester changed meanwhile.
          if (requestId !== this.creditHoursRequestId) {
            return;
          }

          this.enrolledCreditHours = creditHours ?? 0;
          this.calculateTotalFee();
        },
        error: err => {
          if (requestId !== this.creditHoursRequestId) {
            return;
          }

          console.error('Error loading semester credit hours:', err);

          this.enrolledCreditHours = 0;
          this.calculateTotalFee();

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to load credit hours for the selected semester.'
          });
        }
      });
  }

  // Total = (credit hours × rate) + fixed semester charge
  calculateTotalFee(): void {
    const rate = this.feeForm.controls.ratePerCreditHour.value ?? 0;
    const fixedCharge = this.feeForm.controls.fixedSemesterCharge.value ?? 0;

    this.calculatedTotalFee =
      (this.enrolledCreditHours * rate) + fixedCharge;

    this.totalFeeValue.set(this.calculatedTotalFee);
  }

  previewStatus(totalFee: number, paidFee: number): string {
    if (totalFee > 0 && paidFee >= totalFee) {
      return 'PAID';
    }

    if (paidFee > 0 && paidFee < totalFee) {
      return 'PENDING';
    }

    return 'OVERDUE';
  }

  // Open Add Fee dialog
openAddForm(): void {
  this.editingFeeId = null;
  this.enrolledCreditHours = 0;
  this.calculatedTotalFee = 0;
  this.totalFeeValue.set(0);
  this.paidFeeValue.set(0);

  this.feeForm.controls.semester.enable({ emitEvent: false });

  this.feeForm.reset({
    semester: '',
    ratePerCreditHour: 5000,
    fixedSemesterCharge: 15000,
    paidFee: 0
  });

  this.dialogSemesters.set(this.availableSemesters());
  this.showAddForm = true;

  this.loadAvailableSemesters();
}

openEditForm(fee: Fee): void {
  this.editingFeeId = fee.id;

  this.enrolledCreditHours = 0;
  this.calculatedTotalFee = fee.totalFee;
  this.totalFeeValue.set(fee.totalFee);
  this.paidFeeValue.set(fee.paidFee);

  this.dialogSemesters.set([fee.semester]);

  this.feeForm.controls.semester.enable({ emitEvent: false });
  this.feeForm.setValue({
    semester: fee.semester,
    ratePerCreditHour: fee.ratePerCreditHour,
    fixedSemesterCharge: fee.fixedSemesterCharge,
    paidFee: fee.paidFee
  });
  this.feeForm.controls.semester.disable({ emitEvent: false });

  this.showAddForm = true;
}

  closeForm(): void {
    this.showAddForm = false;
    this.editingFeeId = null;
    this.creditHoursRequestId++;
  }

  // Save a new fee or update an existing one
  save(): void {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    const formValue = this.feeForm.getRawValue();
    const semester = formValue.semester;

    if (!semester) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select Semester',
        detail: 'Please select a semester.'
      });
      return;
    }

    if (this.enrolledCreditHours <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Enrollments',
        detail: 'Enroll the student in courses for this semester before creating a fee.'
      });
      return;
    }

    if (formValue.paidFee > this.calculatedTotalFee) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Paid Amount',
        detail: 'Paid fee cannot exceed the total fee.'
      });
      return;
    }

    const feeData: FeeRequest = {
      semester,
      ratePerCreditHour: formValue.ratePerCreditHour,
      fixedSemesterCharge: formValue.fixedSemesterCharge,
      paidFee: formValue.paidFee
    };

    if (this.editingFeeId !== null) {
      const feeId = this.editingFeeId;

      this.feeService.updateFees(feeId, feeData).subscribe({
        next: () => {
          this.closeForm();
          this.loadFees();
          this.loadAvailableSemesters();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Fee record updated successfully.'
          });
        },
        error: err => {
          console.error('Error updating fee:', err);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? 'Unable to update fee record.'
          });
        }
      });

      return;
    }

    this.feeService.createFee(this.studentId, feeData).subscribe({
      next: () => {
        this.closeForm();
        this.loadFees();
        this.loadAvailableSemesters();

        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Fee record added successfully.'
        });
      },
      error: err => {
        console.error('Error creating fee:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message ?? 'Unable to create fee record.'
        });
      }
    });
  }

  // Delete fee record after confirmation
  deleteFee(feeId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this fee record?',
      header: 'Delete Fee Record',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',

      accept: () => {
        this.feeService.deleteFee(feeId).subscribe({
          next: () => {
            this.loadFees();
            this.loadAvailableSemesters();

            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Fee record deleted successfully.'
            });
          },
          error: err => {
            console.error('Error deleting fee:', err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.message ?? 'Unable to delete fee record.'
            });
          }
        });
      }
    });
  }
}
