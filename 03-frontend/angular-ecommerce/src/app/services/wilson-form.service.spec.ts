import { TestBed } from '@angular/core/testing';

import { WilsonFormService } from './wilson-form.service';

describe('WilsonFormService', () => {
  let service: WilsonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WilsonFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
