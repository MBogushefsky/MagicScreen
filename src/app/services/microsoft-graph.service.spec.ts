import { TestBed } from '@angular/core/testing';

import { MicrosoftGraphService } from './microsoft-graph.service';

describe('MicrosoftGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MicrosoftGraphService = TestBed.get(MicrosoftGraphService);
    expect(service).toBeTruthy();
  });
});
