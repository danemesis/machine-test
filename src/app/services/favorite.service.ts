import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, fromEvent, map } from 'rxjs';
import { components } from '../../types/clinicaltrials';
import { studyEqual } from '../shared/studies/equal';
import { Study } from '../types/study';

const LS_FAVORITE_KEY = 'LS_FAVORITE_KEY';

@Injectable({
  providedIn: 'root',
})
export class ClinicalTrialFavoriteService {
  #documentRef = inject(DOCUMENT);

  #favorites = signal<Study[]>([]);
  // this is additional (non-essential API) for Signal-Observable bridge
  #favorites$ = toObservable(this.#favorites).pipe(
    map(studies => studies.map(study => ({ ...study, favorite: true })))
  );

  constructor() {
    fromEvent(this.#documentRef, 'visibilitychange')
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        localStorage.setItem(
          LS_FAVORITE_KEY,
          JSON.stringify(this.#favorites())
        );
      });
  }

  getFavorites$() {
    if (this.#favorites().length > 0) {
      return this.#favorites$;
    }

    const storedItems = localStorage.getItem(LS_FAVORITE_KEY);
    try {
      this.#favorites.set(JSON.parse(storedItems ?? '[]'));
    } catch (err) {
      console.error(
        'Something went wrong while trying to get favorites studies',
        err
      );
    }

    return this.#favorites$;
  }

  setFavorite(study: Study) {
    this.#favorites.update(favorites =>
      [...(favorites ?? []), study].slice(-10)
    );
  }

  removeFavorite(study: components['schemas']['Study']) {
    this.#favorites.update(favorites => {
      return [
        ...(favorites ?? []).filter(favorite => !studyEqual(favorite, study)),
      ];
    });
  }

  isFavorite(study: components['schemas']['Study']) {
    return this.#favorites()?.some(favoriteStudy =>
      studyEqual(favoriteStudy, study)
    );
  }

  markFavorite(study: components['schemas']['Study']): Study {
    return {
      ...study,
      favorite:
        this.#favorites()?.some(favoriteStudy =>
          studyEqual(favoriteStudy, study)
        ) ?? false,
    };
  }

  markFavorites(studies: components['schemas']['Study'][]): Study[] {
    // Set is to keep O(2n) complexity
    const favoritesSet = new Set(
      this.#favorites().map(
        study => study.protocolSection?.identificationModule?.nctId
      )
    );
    return studies.map(study => ({
      ...study,
      favorite: favoritesSet.has(
        study.protocolSection?.identificationModule?.nctId
      ),
    }));
  }
}
