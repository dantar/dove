import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OggettoViewComponent } from './oggetto-view.component';

describe('OggettoViewComponent', () => {
  let component: OggettoViewComponent;
  let fixture: ComponentFixture<OggettoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OggettoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OggettoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
