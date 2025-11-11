import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Customers</h1>
  </div>

  <div class="card shadow">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">Customer Directory</h6>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table mb-0">
          <thead class="thead-light">
            <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Jane Smith</td><td>jane@example.com</td><td>+84 912 345 678</td><td>8</td><td>$890.00</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
})
export class CustomersListComponent {}
