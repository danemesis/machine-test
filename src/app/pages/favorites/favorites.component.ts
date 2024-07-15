import { Component, inject } from '@angular/core';
import { StudiesListComponent } from '../../components/studies/studies.component';
import { ClinicalTrialFavoriteService } from '../../services/favorite.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.component.html',
  imports: [AsyncPipe, StudiesListComponent],
})
export class FavoritesComponent {
  clinicalTrialFavoriteService = inject(ClinicalTrialFavoriteService);

  studies$ = this.clinicalTrialFavoriteService.getFavorites$();
}
