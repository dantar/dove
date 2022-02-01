import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeBrokerComponent } from './qr-code-broker.component';

describe('QrCodeBrokerComponent', () => {
  let component: QrCodeBrokerComponent;
  let fixture: ComponentFixture<QrCodeBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrCodeBrokerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
