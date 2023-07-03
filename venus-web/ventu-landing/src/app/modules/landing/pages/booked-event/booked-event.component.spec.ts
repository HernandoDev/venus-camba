import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedEventComponent } from './booked-event.component';

describe('BookedEventComponent', () => {
  let component: BookedEventComponent;
  let fixture: ComponentFixture<BookedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookedEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
