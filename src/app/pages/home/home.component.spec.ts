import { TestBed } from '@angular/core/testing';

import { throttleTime } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let testScheduler: TestScheduler;

  beforeEach(async () => {
    new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [],
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
