import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OggettoEditComponent } from './oggetto-edit.component';

describe('OggettoEditComponent', () => {
  let component: OggettoEditComponent;
  let fixture: ComponentFixture<OggettoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OggettoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OggettoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
