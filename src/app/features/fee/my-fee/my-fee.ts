import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FeeService } from '../fee-service';

import {
  Fee,
  FeeSummary
} from '../../../models/fee.model';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-my-fee',
  standalone: true,

  imports: [
    CommonModule,

    /* PrimeNG */
    CardModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    MessageModule
  ],

  templateUrl: './my-fee.html',
  styleUrl: './my-fee.css'
})
export class MyFee implements OnInit {

  readonly feeService = inject(FeeService);

  myFees = signal<Fee[]>([]);

  summary = signal<FeeSummary | null>(null);

  loading = signal(true);


  /*
   * Creates the pie chart using CSS conic-gradient.
   */
  get pieChartStyle(): string {

    const s = this.summary();

    if (!s) {
      return '';
    }

    const paidDeg =
      (s.paidPercentage / 100) * 360;

    return `
      conic-gradient(
        #16a34a 0deg ${paidDeg}deg,
        #dc2626 ${paidDeg}deg 360deg
      )
    `;
  }


  /*
   * Returns PrimeNG tag severity
   * according to fee status.
   */
  getStatusSeverity(
    status: string
  ): 'success' | 'warn' | 'danger' | 'info' {

    switch (status.toLowerCase()) {

      case 'paid':
        return 'success';

      case 'pending':
        return 'warn';

      case 'overdue':
        return 'danger';

      default:
        return 'info';
    }
  }


  /*
   * Loads student's fee records
   * and fee summary.
   */
  ngOnInit(): void {

    this.feeService.getMyFees().subscribe({

      next: (data) => {
        this.myFees.set(data);
        this.loading.set(false);
      },

      error: (err) => {

        console.error(
          'Error fetching fees:',
          err
        );

        this.loading.set(false);
      }
    });


    this.feeService.getMyFeeSummary().subscribe({

      next: (data) => {
        this.summary.set(data);
      },

      error: (err) => {

        console.error(
          'Error fetching fee summary:',
          err
        );
      }
    });
  }
}