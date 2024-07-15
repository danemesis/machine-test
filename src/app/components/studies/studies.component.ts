import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { components } from '../../../types/clinicaltrials';
import { ClinicalTrialService } from '../../services/clinical-trials.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [
    CommonModule,
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
}
