import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeService } from '../fee-service';
import { Fee } from '../../../models/fee.model';

@Component({
  selector: 'app-my-fee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-fee.html',
  styleUrl: './my-fee.css',
})
export class MyFee implements OnInit {
  readonly feeService = inject(FeeService);

  myFees = signal<Fee[]>([]);

  ngOnInit(): void {
    this.feeService.getMyFees().subscribe({
      next: (data) => this.myFees.set(data),
      error: (err) => console.error('Error fetching fees:', err)
    });
  }
}