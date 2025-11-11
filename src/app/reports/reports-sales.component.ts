import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Sales Reports</h1>
  </div>

  <div class="card shadow mb-4">
    <div class="card-header py-3"><h6 class="m-0 font-weight-bold text-primary">Monthly Revenue</h6></div>
    <div class="card-body">
      <canvas id="salesChart" height="120"></canvas>
    </div>
  </div>
  `,
})
export class ReportsSalesComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const w = window as any;
    const Chart = w.Chart as any;
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement | null;
    if (!Chart || !canvas) return;
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{ label: 'Revenue', backgroundColor: '#4e73df', data: [12,19,11,15,22,30,28,26,18,24,20,27] }]
      },
      options: { legend: { display: false }, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
    });
  }
}
