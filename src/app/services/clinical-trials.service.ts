import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { components } from '../../types/clinicaltrials';
import { ApiClinicalTrialServices } from '../api/clinical-trial.service';

@Injectable({
  providedIn: 'root',
})
export class ClinicalTrialService {
  #apiClinicalTrial = inject(ApiClinicalTrialServices);

  #nextPageToken = signal('');
  #cachedStudies = signal<components['schemas']['Study'][] | null>(null);

  getStudies(params?: Parameters<ApiClinicalTrialServices['getStudies']>[0]) {
    return this.#apiClinicalTrial.getStudies(params).pipe(
      tap(
        ({ nextPageToken }) =>
          nextPageToken && this.#nextPageToken.set(nextPageToken)
      ),
      map(({ studies }) => studies)
    );
  }

  getNextStudy() {
    const cachedStudies = this.#cachedStudies();
    if (cachedStudies && cachedStudies.length > 0) {
      return this.#getOneAndCacheStudies(cachedStudies);
    }

    return this.#apiClinicalTrial
      .getStudies({ pageSize: 10, pageToken: this.#nextPageToken() })
      .pipe(
        map(({ studies, nextPageToken }) => {
          if (nextPageToken) {
            this.#nextPageToken.set(nextPageToken);
          }

          return this.#getOneAndCacheStudies(studies);
        })
      );
  }

  #getOneAndCacheStudies(studies: components['schemas']['Study'][]) {
    const [returnStudy, ...restStudies] = studies;
    this.#cachedStudies.set(restStudies);

    return returnStudy;
  }
}
