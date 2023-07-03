import { TestBed } from '@angular/core/testing';

import { AnfitrionService } from './anfitrion.service';

describe('AnfitrionService', () => {
  let service: AnfitrionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnfitrionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
