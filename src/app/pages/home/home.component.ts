import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { KnobModule } from 'primeng/knob';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  filter,
  map,
  scan,
  shareReplay,
  skip,
  switchMap,
  take,
  takeWhile,
  timer,
  withLatestFrom,
} from 'rxjs';
import { StudiesListComponent } from '../../components/studies/studies.component';
import { ClinicalTrialService } from '../../services/clinical-trials.service';
import { ClinicalTrialFavoriteService } from '../../services/favorite.service';
import { Study } from '../../types/study';

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
  clinicalTrialFavoriteService = inject(ClinicalTrialFavoriteService);

  readonly #PAGE_SIZE = 10;
  readonly #UPDATE_TIMEOUT = 5_000;

  #studies$$ = new BehaviorSubject<Study[]>([]);
  studies$ = combineLatest([
    this.#studies$$.asObservable(),
    this.clinicalTrialFavoriteService.getFavorites$(),
  ]).pipe(
    map(([studies]) => this.clinicalTrialFavoriteService.markFavorites(studies))
  );

  #trigger$ = this.#studies$$.asObservable().pipe(
    filter(studies => studies.length > 0),
    take(1),
    switchMap(() => timer(0, this.#UPDATE_TIMEOUT)),
    shareReplay(1)
  );

  /** Used to show a user that this study will be replaced with another one, random */
  studyScheduledForUpdate$ = this.#trigger$.pipe(
    switchMap((studyCount: number) =>
      this.#studies$$
        .asObservable()
        .pipe(map((studies): [number, Study[]] => [studyCount, studies]))
    ),
    map(([studyCount, studies]: [number, Study[]]) => {
      const studyPositionBeingUpdated = studyCount % 10;
      return studies[studyPositionBeingUpdated] as Study;
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
    // Get initial number of Clinical trials
    this.#clinicalTrialService
      .getStudies({
        pageSize: this.#PAGE_SIZE,
      })
      .subscribe(studies => this.#studies$$.next(studies));

    /** @TODO This is a bit complex and I would need to think extra on
     * how I would separate this one.
     *
     * Idea of this is to:
     * 1. Once we marked "row" that it is being updated (css styles are applied (UX))
     * 2. Get next study (or fetch next batch of studies). In parallel,
     * 3. Once this is done AND it is time to update the entry update the studies list (auto swapped it, gracefully).
     */
    this.studyScheduledForUpdate$
      .pipe(
        withLatestFrom(this.#studies$$),
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
        /** @TODO @FIXME delay should be removed (= I need another trigger, timer shows 0?) */
        delay(0),
        switchMap(newUpdatedStudiesList =>
          this.#trigger$.pipe(
            skip(1), // skip one received from shared replay subject
            take(1),
            map(() => newUpdatedStudiesList)
          )
        )
      )
      .subscribe(studies => this.#studies$$.next(studies));
  }
}
