import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaScatolaFilterComponent } from './scheda-scatola-filter.component';

describe('SchedaScatolaFilterComponent', () => {
  let component: SchedaScatolaFilterComponent;
  let fixture: ComponentFixture<SchedaScatolaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaScatolaFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaScatolaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
