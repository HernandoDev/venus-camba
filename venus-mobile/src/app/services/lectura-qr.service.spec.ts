import { TestBed } from '@angular/core/testing';

import { LecturaQRService } from './lectura-qr.service';

describe('LecturaQRService', () => {
  let service: LecturaQRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaQRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
