import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalUsuarioQrEventoPage } from './modal-usuario-qr-evento.page';

describe('ModalUsuarioQrEventoPage', () => {
  let component: ModalUsuarioQrEventoPage;
  let fixture: ComponentFixture<ModalUsuarioQrEventoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUsuarioQrEventoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUsuarioQrEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
