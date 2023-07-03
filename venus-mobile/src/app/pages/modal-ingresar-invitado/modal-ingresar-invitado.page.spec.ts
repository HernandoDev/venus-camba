import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalIngresarInvitadoPage } from './modal-ingresar-invitado.page';

describe('ModalIngresarInvitadoPage', () => {
  let component: ModalIngresarInvitadoPage;
  let fixture: ComponentFixture<ModalIngresarInvitadoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIngresarInvitadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalIngresarInvitadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
