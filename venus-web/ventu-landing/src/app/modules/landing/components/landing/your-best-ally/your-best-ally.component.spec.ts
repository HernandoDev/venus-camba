import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourBestAllyComponent } from './your-best-ally.component';

describe('YourBestAllyComponent', () => {
  let component: YourBestAllyComponent;
  let fixture: ComponentFixture<YourBestAllyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourBestAllyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourBestAllyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
