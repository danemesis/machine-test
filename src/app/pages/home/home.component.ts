import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClinicalTrialService } from '../../services/clinical-trials.service';

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
  providers: [ClinicalTrialService],
})
export class HomeComponent {
  studies$ = inject(ClinicalTrialService).getStudies({ pageSize: 10 });

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
