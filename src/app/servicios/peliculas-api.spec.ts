import { TestBed } from '@angular/core/testing';

import { PeliculasApi } from './peliculas-api';

describe('PeliculasApi', () => {
  let service: PeliculasApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeliculasApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
