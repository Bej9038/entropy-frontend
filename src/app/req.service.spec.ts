import { TestBed } from '@angular/core/testing';

import { ReqService } from './req.service';

describe('PromptService', () => {
  let service: ReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
