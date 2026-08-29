import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../department-service';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-department-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department-manager.html',
  styleUrl: './department-manager.css',
})
export class DepartmentManager implements OnInit {
  readonly departmentService = inject(DepartmentService);

  departments = signal<Department[]>([]);
  searchTerm = signal('');
  showAddModal = signal(false);

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
        this.loadDepartments();
      },
      error: (err) => this.errorMessage.set(err.error || 'Failed to add department.')
    });
  }

  deleteDepartment(id: number): void {
    const confirmDelete = confirm("Delete this department? Courses linked to it may be affected.");
    if (!confirmDelete) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => this.loadDepartments(),
      error: (err) => console.error('Error deleting department:', err)
    });
  }
}