import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RespuestaLecturaPage } from './respuesta-lectura.page';

describe('RespuestaLecturaPage', () => {
  let component: RespuestaLecturaPage;
  let fixture: ComponentFixture<RespuestaLecturaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestaLecturaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RespuestaLecturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
