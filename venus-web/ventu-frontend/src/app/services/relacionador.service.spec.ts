import { TestBed } from '@angular/core/testing';

import { RelacionadorService } from './relacionador.service';

describe('RelacionadorService', () => {
  let service: RelacionadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelacionadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
