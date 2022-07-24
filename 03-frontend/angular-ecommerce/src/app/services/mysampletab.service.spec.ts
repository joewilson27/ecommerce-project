import { TestBed } from '@angular/core/testing';

import { MysampletabService } from './mysampletab.service';

describe('MysampletabService', () => {
  let service: MysampletabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MysampletabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
