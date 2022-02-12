import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OggettoThumbnailComponent } from './oggetto-thumbnail.component';

describe('OggettoThumbnailComponent', () => {
  let component: OggettoThumbnailComponent;
  let fixture: ComponentFixture<OggettoThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OggettoThumbnailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OggettoThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
