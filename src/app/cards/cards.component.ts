import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Cards</h1>
  </div>

  <div class="row">
    <div class="col-xl-3 col-md-6 mb-4" *ngFor="let card of kpiCards">
      <div class="card" [ngClass]="card.border + ' shadow h-100 py-2'">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-uppercase mb-1" [ngClass]="card.text">{{card.title}}</div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">{{card.value}}</div>
            </div>
            <div class="col-auto">
              <i class="fas fa-2x text-gray-300" [ngClass]="card.icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-6">
      <div class="card mb-4">
        <div class="card-header">Default Card Example</div>
        <div class="card-body">
          This card uses Bootstrap's default styling with no utility classes added.
        </div>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Basic Card Example</h6>
        </div>
        <div class="card-body">
          The styling for this basic card example is created by using default Bootstrap utility classes.
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Dropdown Card Example</h6>
          <div class="dropdown no-arrow">
            <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
              <div class="dropdown-header">Dropdown Header:</div>
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          Dropdown menus can be placed in the card header in order to extend the functionality of a basic card.
        </div>
      </div>

      <div class="card shadow mb-4">
        <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
          <h6 class="m-0 font-weight-bold text-primary">Collapsable Card Example</h6>
        </a>
        <div class="collapse show" id="collapseCardExample">
          <div class="card-body">
            This is a collapsable card example using Bootstrap's built in collapse functionality.
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class CardsComponent {
  kpiCards = [
    { title: 'Earnings (Monthly)', value: '$40,000', border: 'border-left-primary', text: 'text-primary', icon: 'fa-calendar' },
    { title: 'Earnings (Annual)', value: '$215,000', border: 'border-left-success', text: 'text-success', icon: 'fa-dollar-sign' },
    { title: 'Tasks', value: '50%', border: 'border-left-info', text: 'text-info', icon: 'fa-clipboard-list' },
    { title: 'Pending Requests', value: '18', border: 'border-left-warning', text: 'text-warning', icon: 'fa-comments' },
  ];
}
