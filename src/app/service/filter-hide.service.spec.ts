import { TestBed } from '@angular/core/testing';

import { FilterHideService } from './filter-hide.service';

describe('FilterHideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterHideService = TestBed.get(FilterHideService);
    expect(service).toBeTruthy();
  });
});
