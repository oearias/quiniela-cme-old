import { TestBed } from '@angular/core/testing';

import { PartidoService } from './partido.service';

describe('PartidoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartidoService = TestBed.get(PartidoService);
    expect(service).toBeTruthy();
  });
});
