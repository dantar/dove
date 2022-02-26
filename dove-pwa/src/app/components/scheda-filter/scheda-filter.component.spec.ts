import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaFilterComponent } from './scheda-filter.component';

describe('SchedaFilterComponent', () => {
  let component: SchedaFilterComponent;
  let fixture: ComponentFixture<SchedaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
