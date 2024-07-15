import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { ApiClinicalTrialServices } from '../api/clinical-trial.service';
import { Study } from '../types/study';
import { ClinicalTrialFavoriteService } from './favorite.service';

@Injectable()
export class ClinicalTrialService {
  #apiClinicalTrial = inject(ApiClinicalTrialServices);
  #clinicalTrialFavoriteService = inject(ClinicalTrialFavoriteService);

  #nextPageToken = signal('');
  #cachedStudies = signal<Study[] | null>(null);

  getStudies(params?: Parameters<ApiClinicalTrialServices['getStudies']>[0]) {
    return this.#apiClinicalTrial.getStudies(params).pipe(
      tap(
        ({ nextPageToken }) =>
          nextPageToken && this.#nextPageToken.set(nextPageToken)
      ),
      map(({ studies }) =>
        this.#clinicalTrialFavoriteService.markFavorites(studies)
      )
    );
  }

  getNextStudy() {
    const cachedStudies = this.#cachedStudies();
    if (cachedStudies && cachedStudies.length > 0) {
      return of(this.#getOneAndCacheStudies(cachedStudies));
    }

    return this.#apiClinicalTrial
      .getStudies({ pageSize: 10, pageToken: this.#nextPageToken() })
      .pipe(
        tap(
          ({ nextPageToken }) =>
            nextPageToken && this.#nextPageToken.set(nextPageToken)
        ),
        map(({ studies }) => {
          return this.#getOneAndCacheStudies(
            this.#clinicalTrialFavoriteService.markFavorites(studies)
          );
        })
      );
  }

  #getOneAndCacheStudies(studies: Study[]) {
    const [returnStudy, ...restStudies] = studies;
    this.#cachedStudies.set(restStudies);

    return returnStudy;
  }
}
