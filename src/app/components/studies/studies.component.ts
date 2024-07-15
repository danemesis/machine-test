import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { components } from '../../../types/clinicaltrials';
import { ClinicalTrialService } from '../../services/clinical-trials.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [
    CommonModule,
    //
    ButtonModule,
    TableModule,
    //
  ],
  templateUrl: './studies.component.html',
  providers: [ClinicalTrialService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudiesListComponent {
  studies = input.required<components['schemas']['StudyList']>();
  studyScheduledForUpdate = input<components['schemas']['Study'] | null>();

  @Output()
  setFavorite = new EventEmitter<components['schemas']['Study']>();

  @Output()
  removeFavorite = new EventEmitter<components['schemas']['Study']>();

  studiesInt = computed(() =>
    this.studies().map(
      study => study.protocolSection?.identificationModule?.nctId
    )
  );
}
