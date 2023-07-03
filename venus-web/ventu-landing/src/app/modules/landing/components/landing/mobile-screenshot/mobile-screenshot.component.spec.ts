import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileScreenshotComponent } from './mobile-screenshot.component';

describe('MobileScreenshotComponent', () => {
  let component: MobileScreenshotComponent;
  let fixture: ComponentFixture<MobileScreenshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileScreenshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileScreenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
