import { DOCUMENT } from '@angular/common';
import { HostListener, inject, Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { components } from '../../types/clinicaltrials';
import { studyEqual } from '../shared/studies/equal';
import { Study } from '../types/study';
import { toObservable } from '@angular/core/rxjs-interop';

const LS_FAVORITE_KEY = 'LS_FAVORITE_KEY';

@Injectable({
  providedIn: 'root',
})
export class ClinicalTrialFavoriteService {
  #documentRef = inject(DOCUMENT);

  #favorites = signal<components['schemas']['Study'][] | null>(null);
  // this is additional (non-essential API) for Signal-Observable bridge
  #favorites$ = toObservable(this.#favorites);

  /** @TODO @FIXME VISIBILITYCHANGE(START) is not being called. Why? */
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange(ev: any) {
    console.log('test vi', ev);
  }

  constructor() {
    fromEvent(this.#documentRef, 'visibilitychange')
      // .pipe(distinctUntilChanged())
      .subscribe(v => console.log('visibilitychange', v));

    document.addEventListener('visibilitychange', () => {
      console.log(document.hidden);
    });
  }
  /**
   * VISIBILITYCHANGE(END)
   */

  getFavorites$() {
    if (this.#favorites()) {
      return this.#favorites$;
    }

    const storedItems = localStorage.getItem(LS_FAVORITE_KEY);
    try {
      this.#favorites.set(JSON.parse(storedItems ?? '[]'));
      return this.#favorites();
    } catch (err) {
      console.error(
        'Something went wrong while trying to get favorites studies',
        err
      );
    }

    return [];
  }

  setFavorite(study: components['schemas']['Study']) {
    this.#favorites.update(favorites => [...(favorites ?? []), study]);
    /** @TODO save data once before unload through visibility change  */
    localStorage.setItem(
      LS_FAVORITE_KEY,
      JSON.stringify(this.#favorites()?.concat(study))
    );
  }

  removeFavorite(study: components['schemas']['Study']) {
    this.#favorites.update(favorites => [
      ...(favorites ?? []).filter(favorite => studyEqual(favorite, study)),
    ]);
    /** @TODO save data once before unload through visibility change  */
    localStorage.setItem(
      LS_FAVORITE_KEY,
      JSON.stringify(this.#favorites()?.concat(study))
    );
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
    const favoritesSet = new Set(
      studies.map(study => study.protocolSection?.identificationModule?.nctId)
    );
    return studies.map(study => ({
      ...study,
      favorite: favoritesSet.has(
        study.protocolSection?.identificationModule?.nctId
      ),
    }));
  }
}
