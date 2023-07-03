import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalAgregarInvitadoPage } from './modal-agregar-invitado.page';

describe('ModalAgregarInvitadoPage', () => {
  let component: ModalAgregarInvitadoPage;
  let fixture: ComponentFixture<ModalAgregarInvitadoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAgregarInvitadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAgregarInvitadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
