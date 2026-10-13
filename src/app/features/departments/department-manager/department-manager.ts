import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../department-service';
import { Department } from '../../../models/department.model';
import { FloatLabelModule } from 'primeng/floatlabel';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-department-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, InputGroupModule, ToastModule, ConfirmDialog,ScrollPanelModule],
  templateUrl: './department-manager.html',
  providers: [MessageService, ConfirmationService],
  styleUrl: './department-manager.css',
  
})
export class DepartmentManager implements OnInit {
  readonly departmentService = inject(DepartmentService);
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);

  departments = signal<Department[]>([]);
  searchTerm = signal('');
  showAddModal = signal(false);
  editingDepartmentId = signal<number | null>(null);

  departmentForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  errorMessage = signal('');

   filteredDepartments = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.departments();
    return this.departments().filter(d => d.name.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error loading departments:', err)
    });
  }

openAddModal(): void {
    this.errorMessage.set('');
    this.departmentForm.reset();
    this.showAddModal.set(true);
  }


  openEditModal(department: Department): void {

    this.editingDepartmentId.set(department.id);
    this.errorMessage.set('');
    this.departmentForm.patchValue({name: department.name});
    this.showAddModal.set(true);

  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }


  save(): void {
  if (this.departmentForm.invalid) {
    this.departmentForm.markAllAsTouched();
    return;
  }

  this.errorMessage.set('');

  const deptData = this.departmentForm.getRawValue();

  this.departmentService.createDepartment(deptData).subscribe({
    next: () => {
      this.departmentForm.reset();
      this.showAddModal.set(false);
      this.loadDepartments();

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Department added successfully.'
      });
    },
    error: (err) => {
      this.errorMessage.set(
        err.error || 'Failed to add department.'
      );

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error || 'Failed to add department.'
      });
    }
  });
}

  deleteDepartment(id: number): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this department?',
    header: 'Delete Department',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',

    accept: () => {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Department deleted successfully.'
          });
        },

        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error || 'Failed to delete department.'
          });
        }
      });
    }
  });
}
}