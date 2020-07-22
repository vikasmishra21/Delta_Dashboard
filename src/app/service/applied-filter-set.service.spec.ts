import { TestBed } from '@angular/core/testing';

import { AppliedFilterSetService } from './applied-filter-set.service';

describe('AppliedFilterSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppliedFilterSetService = TestBed.get(AppliedFilterSetService);
    expect(service).toBeTruthy();
  });
});
