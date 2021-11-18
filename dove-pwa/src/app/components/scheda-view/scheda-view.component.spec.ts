import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaViewComponent } from './scheda-view.component';

describe('SchedaViewComponent', () => {
  let component: SchedaViewComponent;
  let fixture: ComponentFixture<SchedaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
