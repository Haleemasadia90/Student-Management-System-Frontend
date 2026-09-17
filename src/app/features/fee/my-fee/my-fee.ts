import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeService } from '../fee-service';
import { Fee, FeeSummary } from '../../../models/fee.model';

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
  summary = signal<FeeSummary | null>(null);

  get pieChartStyle(): string {

    const s = this.summary();
    if (!s) return '';
const paidDeg = (s.paidPercentage / 100) * 360;
    return `conic-gradient(#16a34a 0deg ${paidDeg}deg, #dc2626 ${paidDeg}deg 360deg)`;
  }
    

  ngOnInit(): void {
    this.feeService.getMyFees().subscribe({
      next: (data) => this.myFees.set(data),
      error: (err) => console.error('Error fetching fees:', err)
    });

    this.feeService.getMyFeeSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error('Error fetching fee summary:', err)
    });
  }
}