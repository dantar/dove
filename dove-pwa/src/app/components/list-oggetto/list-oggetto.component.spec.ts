import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOggettoComponent } from './list-oggetto.component';

describe('ListOggettoComponent', () => {
  let component: ListOggettoComponent;
  let fixture: ComponentFixture<ListOggettoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOggettoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOggettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
