import { TestBed } from '@angular/core/testing';

import { AppToastServiceService } from './app-toast-service.service';

describe('AppToastServiceService', () => {
  let service: AppToastServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppToastServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
