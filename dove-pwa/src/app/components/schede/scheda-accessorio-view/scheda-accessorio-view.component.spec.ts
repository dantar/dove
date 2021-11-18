import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaAccessorioViewComponent } from './scheda-accessorio-view.component';

describe('SchedaAccessorioViewComponent', () => {
  let component: SchedaAccessorioViewComponent;
  let fixture: ComponentFixture<SchedaAccessorioViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaAccessorioViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaAccessorioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
