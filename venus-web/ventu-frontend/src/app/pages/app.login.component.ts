import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AppComponent } from "../app.component";
import { MessageService } from "primeng/api";
import { LoginService } from "../services/login.service";
import { Router } from "@angular/router";
import { StorageService } from "../services/storage.service";

@Component({
    selector: "app-login",
    templateUrl: "./app.login.component.html",
})
export class AppLoginComponent implements OnInit {
    formularioLogin: FormGroup;
    mostrarSpinner: boolean = false;

    constructor(
        public app: AppComponent,
        private messageService: MessageService,
        private loginService: LoginService,
        private router: Router,
        private storageService: StorageService
    ) {
        this.formularioLogin = new FormGroup({
            correo: new FormControl("", [
                Validators.required,
                Validators.email,
            ]),
            contrasenha: new FormControl("", Validators.required),
        });
    }

    ngOnInit(): void {}

    iniciarSesion(): void {
        if (!this.formularioLogin.valid) {
            this.mostrarToast(
                "error",
                "Por favor, ingrese datos válidos",
                "Error"
            );
            return;
        }
        const formulario = this.formularioLogin.value;
        this.mostrarSpinner = true;
        this.loginService
            .iniciarSesion(formulario.correo, formulario.contrasenha)
            .subscribe((res: any) => {
                this.mostrarSpinner = false;
                console.log(res);
                if (res.success) {
                    // guardar token y usuario en localStorage
                    this.storageService.setUsuario(res.data.usuario);
                    this.storageService.setToken(res.data.usuario.token_jwt);
                    // limpiar el formulario
                    this.formularioLogin.reset();
                    // redireccionar a la página principal
                    this.router.navigate(["/host/lista-eventos"]);
                    // mostrar toast
                    this.mostrarToast("success", res.message, "Éxito");
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            }, (error) => {
                this.mostrarSpinner = false;
                this.mostrarToast("error", error.message, "Error");
            });
    }

    mostrarToast(tipo: string, mensaje: string, titulo: string) {
        this.messageService.add({
            severity: tipo,
            summary: titulo,
            detail: mensaje,
        });
    }
}
