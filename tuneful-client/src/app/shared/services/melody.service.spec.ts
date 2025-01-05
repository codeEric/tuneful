import { TestBed } from '@angular/core/testing';

import { MelodyService } from './melody.service';

describe('MelodyService', () => {
  let service: MelodyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MelodyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
