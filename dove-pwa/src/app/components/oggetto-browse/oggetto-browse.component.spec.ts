import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OggettoBrowseComponent } from './oggetto-browse.component';

describe('OggettoBrowseComponent', () => {
  let component: OggettoBrowseComponent;
  let fixture: ComponentFixture<OggettoBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OggettoBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OggettoBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
