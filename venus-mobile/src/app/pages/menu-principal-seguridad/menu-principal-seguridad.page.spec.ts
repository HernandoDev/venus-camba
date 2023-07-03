import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuPrincipalSeguridadPage } from './menu-principal-seguridad.page';

describe('MenuPrincipalSeguridadPage', () => {
  let component: MenuPrincipalSeguridadPage;
  let fixture: ComponentFixture<MenuPrincipalSeguridadPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPrincipalSeguridadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPrincipalSeguridadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
