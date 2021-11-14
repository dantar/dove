import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostoViewComponent } from './posto-view.component';

describe('PostoViewComponent', () => {
  let component: PostoViewComponent;
  let fixture: ComponentFixture<PostoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
