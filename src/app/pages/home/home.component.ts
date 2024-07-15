import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { KnobModule } from 'primeng/knob';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  delay,
  filter,
  map,
  scan,
  shareReplay,
  skip,
  switchMap,
  take,
  takeWhile,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { components } from '../../../types/clinicaltrials';
import { StudiesListComponent } from '../../components/studies/studies.component';
import { ClinicalTrialService } from '../../services/clinical-trials.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    //
    TableModule,
    KnobModule,
    CardModule,
    //
    StudiesListComponent,
  ],
  templateUrl: './home.component.html',
  providers: [ClinicalTrialService],
})
export class HomeComponent implements AfterViewInit {
  #clinicalTrialService = inject(ClinicalTrialService);
  readonly #PAGE_SIZE = 10;
  readonly #UPDATE_TIMEOUT = 5_000;

  studies$$ = new BehaviorSubject<components['schemas']['StudyList']>([]);

  #trigger$ = this.studies$$.pipe(
    filter(studies => studies.length > 0),
    take(1),
    switchMap(() => timer(0, this.#UPDATE_TIMEOUT)),
    tap(v => console.log('TRIGGER', v)),
    shareReplay(1)
  );

  studyScheduledForUpdate$ = this.#trigger$.pipe(
    withLatestFrom(this.studies$$),
    map(([studyCount, studies]) => {
      const studyPositionBeingUpdated = studyCount % 10;
      console.log(
        studyCount,
        studyPositionBeingUpdated,
        studies,
        studies[studyPositionBeingUpdated]
      );

      return studies[studyPositionBeingUpdated];
    }),
    shareReplay(1)
  );

  countDown$ = this.#trigger$.pipe(
    switchMap(() =>
      timer(0, 1000).pipe(
        scan(acc => --acc, 5),
        takeWhile(seconds => seconds >= 0)
      )
    ),
    shareReplay(1)
  );

  ngAfterViewInit(): void {
    this.#clinicalTrialService
      .getStudies({
        pageSize: this.#PAGE_SIZE,
      })
      .subscribe(studies => this.studies$$.next(studies));

    this.studyScheduledForUpdate$
      .pipe(
        withLatestFrom(this.studies$$),
        switchMap(([studyToUpdate, studies]) =>
          this.#clinicalTrialService
            .getNextStudy()
            .pipe(
              map(newStudy =>
                studies.map(study =>
                  study.protocolSection?.identificationModule?.nctId ===
                  studyToUpdate.protocolSection?.identificationModule?.nctId
                    ? newStudy
                    : study
                )
              )
            )
        ),
        delay(0),
        switchMap(newUpdatedStudiesList =>
          this.#trigger$.pipe(
            skip(1), // skip one received from shared replay subject
            take(1),
            map(() => newUpdatedStudiesList)
          )
        )
      )
      .subscribe(studies => this.studies$$.next(studies));
  }
}
