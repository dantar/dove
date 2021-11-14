import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostoBrowseComponent } from './posto-browse.component';

describe('PostoBrowseComponent', () => {
  let component: PostoBrowseComponent;
  let fixture: ComponentFixture<PostoBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostoBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostoBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
