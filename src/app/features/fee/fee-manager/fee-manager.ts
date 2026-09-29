import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { FeeService } from '../fee-service';
import { Fee, FeeRequest } from '../../../models/fee.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MessageService, ConfirmationService } from 'primeng/api';

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
    ConfirmDialogModule
  ],

  templateUrl: './fee-manager.html',
  styleUrl: './fee-manager.css',

  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class FeeManager implements OnInit {

  readonly feeService = inject(FeeService);
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);

  @Input({ required: true })
  studentId!: number;

  @Input({ required: true })
  admissionYear!: number;

  fees = signal<Fee[]>([]);

  showAddForm = false;

  editingFeeId: number | null = null;

  availableSemesters = signal<string[]>([]);

  feeForm = new FormGroup({

    semester: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    totalFee: new FormControl(0, {
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


  totalFeeValue = signal(0);
  paidFeeValue = signal(0);


  computedStatus = computed(() => {

    return this.previewStatus(
      this.totalFeeValue(),
      this.paidFeeValue()
    );

  });


  ngOnInit(): void {

    this.loadFees();
    this.loadAvailableSemesters();

    this.feeForm
      .get('totalFee')
      ?.valueChanges
      .subscribe(value => {

        this.totalFeeValue.set(value ?? 0);

      });


    this.feeForm
      .get('paidFee')
      ?.valueChanges
      .subscribe(value => {

        this.paidFeeValue.set(value ?? 0);

      });

  }


  loadFees(): void {

    this.feeService
      .getFeesByStudentId(this.studentId)
      .subscribe({

        next: data => {
          this.fees.set(data);
        },

        error: err => {
          console.error('Error loading fees:', err);
        }

      });

  }


  loadAvailableSemesters(): void {

    this.feeService
      .getAvailableSemesters(this.studentId)
      .subscribe({

        next: data => {
          this.availableSemesters.set(data);
        },

        error: err => {
          console.error(
            'Error loading available semesters:',
            err
          );
        }

      });

  }


  previewStatus(
    totalFee: number,
    paidFee: number
  ): string {

    if (
      paidFee >= totalFee &&
      totalFee > 0
    ) {
      return 'PAID';
    }

    if (
      paidFee > 0 &&
      paidFee < totalFee
    ) {
      return 'PENDING';
    }

    return 'OVERDUE';
  }


  openAddForm(): void {

    this.editingFeeId = null;

    this.feeForm.reset({
      semester: '',
      totalFee: 0,
      paidFee: 0
    });

    this.totalFeeValue.set(0);
    this.paidFeeValue.set(0);

    this.showAddForm = true;
  }


  openEditForm(fee: Fee): void {

    this.editingFeeId = fee.id;

    this.feeForm.setValue({

      semester: fee.semester,

      totalFee: fee.totalFee,

      paidFee: fee.paidFee

    });

    this.totalFeeValue.set(fee.totalFee);
    this.paidFeeValue.set(fee.paidFee);

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


    const feeData: FeeRequest = {

      ...this.feeForm.getRawValue(),

      status: this.previewStatus(
        this.feeForm.controls.totalFee.value,
        this.feeForm.controls.paidFee.value
      )

    };


    if (this.editingFeeId) {

      this.feeService
        .updateFees(
          this.editingFeeId,
          feeData
        )
        .subscribe({

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

            console.error(
              'Error updating fee:',
              err
            );

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to update fee record.'
            });

          }

        });

    } else {

      this.feeService
        .createFee(
          this.studentId,
          feeData
        )
        .subscribe({

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

            console.error(
              'Error creating fee:',
              err
            );

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to create fee record.'
            });

          }

        });

    }

  }


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

        this.feeService
          .deleteFee(feeId)
          .subscribe({

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

              console.error(
                'Error deleting fee:',
                err
              );

              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to delete fee record.'
              });

            }

          });

      }

    });

  }

}