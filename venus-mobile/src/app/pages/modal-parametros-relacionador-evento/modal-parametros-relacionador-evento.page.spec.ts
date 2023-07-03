import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalParametrosRelacionadorEventoPage } from './modal-parametros-relacionador-evento.page';

describe('ModalParametrosRelacionadorEventoPage', () => {
  let component: ModalParametrosRelacionadorEventoPage;
  let fixture: ComponentFixture<ModalParametrosRelacionadorEventoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalParametrosRelacionadorEventoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalParametrosRelacionadorEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
