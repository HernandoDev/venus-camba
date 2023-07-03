import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateYourEventComponent } from './create-your-event.component';

describe('CreateYourEventComponent', () => {
  let component: CreateYourEventComponent;
  let fixture: ComponentFixture<CreateYourEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateYourEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateYourEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
