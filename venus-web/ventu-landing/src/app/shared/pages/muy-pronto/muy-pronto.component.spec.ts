import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuyProntoComponent } from './muy-pronto.component';

describe('MuyProntoComponent', () => {
  let component: MuyProntoComponent;
  let fixture: ComponentFixture<MuyProntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuyProntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuyProntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
