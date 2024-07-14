import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { map } from 'rxjs';

export const ClinicalTrialsAPI = new InjectionToken('ClinicalTrialsAPI');

@Injectable({
  providedIn: 'root',
})
export class ClinicalTrialServices {
  #http = inject(HttpClient);
  #path = inject(ClinicalTrialsAPI);

  getStudies() {
    return (
      this.#http
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .get<any>(`${this.#path}/studies`)
        .pipe(map(({ hits }) => hits))
    );
  }
}
