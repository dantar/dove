import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaAccessorioFilterComponent } from './scheda-accessorio-filter.component';

describe('SchedaAccessorioFilterComponent', () => {
  let component: SchedaAccessorioFilterComponent;
  let fixture: ComponentFixture<SchedaAccessorioFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaAccessorioFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaAccessorioFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
