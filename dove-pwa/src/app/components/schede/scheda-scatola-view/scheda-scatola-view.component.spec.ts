import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaScatolaViewComponent } from './scheda-scatola-view.component';

describe('SchedaScatolaViewComponent', () => {
  let component: SchedaScatolaViewComponent;
  let fixture: ComponentFixture<SchedaScatolaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaScatolaViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaScatolaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
