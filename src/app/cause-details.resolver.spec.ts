import { TestBed } from '@angular/core/testing';

import { CauseDetailsResolver } from './cause-details.resolver';

describe('CauseDetailsResolver', () => {
  let resolver: CauseDetailsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CauseDetailsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
