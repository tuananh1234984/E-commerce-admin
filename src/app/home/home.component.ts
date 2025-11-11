import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface Item { id: string; name: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul>
      <li *ngFor="let item of items$ | async">
        {{ item.name }}
      </li>
    </ul>
  `,
  styles: []
})
export class HomeComponent {
  title = 'app4';
  firestore: Firestore = inject(Firestore)
  items$: Observable<Item[]>;

  constructor() {
    const itemCollection = collection(this.firestore, 'items');
    this.items$ = collectionData(itemCollection) as Observable<Item[]>;
  }
}
