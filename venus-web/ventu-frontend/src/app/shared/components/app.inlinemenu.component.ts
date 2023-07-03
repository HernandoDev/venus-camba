import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-inlinemenu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('inline', [
            state('hidden', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visible', style({
                height: '*',
            })),
            state('hiddenAnimated', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppInlineMenuComponent {

    constructor(public appMain: AppMainComponent) {
    }

    clickMenuItem(event: Event,ruta){
        if(ruta == 'cerrarSesion'){
            this.appMain.confirmationService.confirm({
                target: event.target,
                acceptLabel: "Sí",
                key: "cerrarSesionDialog",
                message: '¿Estás seguro que quieres cerrar sesión?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.appMain.storageService.borrarStorage();
                    this.appMain.mostrarToast('success', 'Sesión cerrada correctamente', 'Éxito');
                    this.appMain.router.navigate(['/']);
                },
                reject: () => {
                    //reject action
                }
            });
        }
    }

}

