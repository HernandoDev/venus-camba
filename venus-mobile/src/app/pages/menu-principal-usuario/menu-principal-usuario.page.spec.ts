import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuPrincipalUsuarioPage } from './menu-principal-usuario.page';

describe('MenuPrincipalUsuarioPage', () => {
  let component: MenuPrincipalUsuarioPage;
  let fixture: ComponentFixture<MenuPrincipalUsuarioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPrincipalUsuarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPrincipalUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
