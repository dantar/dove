import { TestBed } from '@angular/core/testing';

import { MenuButtonsService } from './menu-buttons.service';

describe('MenuButtonsService', () => {
  let service: MenuButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuButtonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
