import { TestBed } from '@angular/core/testing';

import { throttleTime } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { HomeComponent } from './home.component';
import { ClinicalTrialService } from '../../services/clinical-trials.service';
import { ClinicalTrialFavoriteService } from '../../services/favorite.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let testScheduler: TestScheduler;

  beforeEach(async () => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    const clinicalTrialServiceSpy = jasmine.createSpyObj(
      'ClinicalTrialService',
      ['getStudies', 'getNextStudy']
    );

    const clinicalTrialFavoriteServiceSpy = jasmine.createSpyObj(
      'ClinicalTrialFavoriteService',
      ['getFavorites$', 'markFavorites', 'setFavorite', 'removeFavorite']
    );

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ClinicalTrialService,
          useValue: clinicalTrialServiceSpy,
        },
        {
          provide: ClinicalTrialFavoriteService,
          useValue: clinicalTrialFavoriteServiceSpy,
        },
      ],
    }).compileComponents();
  });

  it('should create the home', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('generates the stream correctly', () => {
    testScheduler.run(helpers => {
      const { cold, time, expectObservable, expectSubscriptions } = helpers;
      const e1 = cold(' -a--b--c---|');
      const e1subs = '  ^----------!';
      const t = time('   ---|       '); // t = 3
      const expected = '-a-----c---|';

      expectObservable(e1.pipe(throttleTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
