import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ClinicalTrialService } from '../../services/clinical-trials.service';
import { Study } from '../../types/study';

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
  studies = input.required<Study[]>();
  studyScheduledForUpdate = input<Study | null>();

  @Output()
  setFavorite = new EventEmitter<Study>();

  @Output()
  removeFavorite = new EventEmitter<Study>();

  studiesInt = computed(() =>
    this.studies().map(
      study => study.protocolSection?.identificationModule?.nctId
    )
  );
}
