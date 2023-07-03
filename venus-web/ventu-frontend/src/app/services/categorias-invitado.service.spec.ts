import { TestBed } from '@angular/core/testing';

import { CategoriasInvitadoService } from './categorias-invitado.service';

describe('CategoriasInvitadoService', () => {
  let service: CategoriasInvitadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasInvitadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
