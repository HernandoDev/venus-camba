import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { StorageService } from 'src/app/services/storage.service';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-left">
                <a href="#" class="topbar-menu-button" (click)="appMain.onMenuButtonClick($event)" *ngIf="appMain.isOverlay() || appMain.isMobile()">
                    <i class="pi pi-bars"></i>
                </a>

                <img class="logo-ventu-topbar" src="../../../assets/images/ventu-logo.png" alt="logo">

            </div>

            <app-menu></app-menu>

            <div class="layout-topbar-right">
                <ul class="layout-topbar-right-items">
                    <li #profile class="profile-item" [ngClass]="{'active-topmenuitem':appMain.activeTopbarItem === profile}">
                        <a href="#" (click)="appMain.onTopbarItemClick($event,profile)">
                            <img *ngIf="appMain.usuario.imagen != null" src="{{appMain.apiUrl + appMain.usuario.imagen}}">
                            <img *ngIf="appMain.usuario.imagen === null" src="assets/images/ventu.png" alt="avatar" style="width: 44px; height: 44px;">
                        </a>

                        <ul class="fadeInDown">
                            <li role="menuitem">
                                <a (click)="appMain.onTopbarSubItemClick($event,'perfil')">
                                    <i class="pi pi-fw pi-user"></i>
                                    <span>Perfil</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a (click)="appMain.onTopbarSubItemClick($event,'ajustes')">
                                    <i class="pi pi-fw pi-cog"></i>
                                    <span>Ajustes</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a (click)="appMain.onTopbarSubItemClick($event,'cerrarSesion')">
                                    <i class="pi pi-fw pi-sign-out"></i>
                                    <span>Cerrar sesión</span>
                                </a>
                            </li>
                            <p-confirmPopup></p-confirmPopup>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class AppTopbarComponent {
    constructor(public app: AppComponent, public appMain: AppMainComponent) {}
}
