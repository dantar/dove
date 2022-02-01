import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccessorioComponent } from './list-accessorio.component';

describe('ListAccessorioComponent', () => {
  let component: ListAccessorioComponent;
  let fixture: ComponentFixture<ListAccessorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAccessorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccessorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
