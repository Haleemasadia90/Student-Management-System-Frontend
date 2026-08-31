import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FeeService } from '../fee-service';
import { Fee } from '../../../models/fee.model';

@Component({
  selector: 'app-fee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-list.html',
  styleUrl: './fee-list.css',
})
export class FeeList implements OnInit {

  readonly feeService = inject(FeeService);

  fees = signal<Fee[]>([]);

  searchId!: number;

  

  ngOnInit(): void {
    this.getFees();
  }

  getFees(): void {
    this.feeService.getAllFees().subscribe({
      next: (data: Fee[]) => {
        this.fees.set(data);
      },
      error: (err) => {
        console.error('Error loading fee records:', err);
      }
    });
  }

  searchFee(): void {

    if (!this.searchId) {
      alert('Please enter Student ID');
      return;
    }

    this.feeService.getFeesByStudentId(this.searchId).subscribe({
      next: (data: Fee[]) => {
        this.fees.set(data);
      },
      error: (err) => {
        console.error('Error searching fee:', err);
        alert('No fee record found');
        this.fees.set([]);
      }
    });
  }

}