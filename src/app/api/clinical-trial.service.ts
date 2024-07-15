import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { components, operations } from '../../types/clinicaltrials';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClinicalTrialServices {
  #http = inject(HttpClient);

  getStudies(query?: operations['listStudies']['parameters']['query']) {
    return this.#http.get<components['schemas']['PagedStudies']>(
      `${environment.clinicalTrialsApi}/studies`,
      { params: query }
    );
  }
}
