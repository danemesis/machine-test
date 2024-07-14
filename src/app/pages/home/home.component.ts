import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClinicalTrialServices } from '../../services/clinical-trials.api.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    //
    TableModule,
    //
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  studies$ = inject(ClinicalTrialServices).getStudies();

  products = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5,
    },
  ];
}
