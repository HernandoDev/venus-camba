import { Component, OnInit, ViewChild ,Input} from "@angular/core";

import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Observable } from 'rxjs';
import { FileUpload } from "primeng/fileupload";
import { AnfitrionService } from "src/app/services/anfitrion.service";
import { GuardiaService } from "src/app/services/guardia.service";
import { StorageService } from "src/app/services/storage.service";
import { environment } from "src/environments/environment";
import {ActivatedRoute, Router} from '@angular/router';
import * as FileSaver from "file-saver";
import { RelacionadorService } from "src/app/services/relacionador.service";

import * as ExcelJS from 'exceljs';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: "app-personal",
    templateUrl: "./personal.component.html",
    styleUrls: ["./personal.component.scss"],
})
export class PersonalComponent implements OnInit {
    //compartido
    // @Input() ventanaEnviar: any;
    listaMenu: MenuItem[] = [];
    
    ventanaActiva: string = "Anfitriones";
    cargandoDatos: boolean = false;
    loading: boolean = false;
    tituloModal;
    apiUrl = environment.API_URL;
    ventanaActivaAux:any;

    // anfitrion
    listaAnfitriones: any[] = [];
    listaAnfitrionesExcelAux:any[];
    anfitrionPadre: any = {};
    mostrarModalAnfitrion: boolean = false;
    formularioAnfitrion: FormGroup;
    anfitrionSeleccionado: any = {};
    // guardia
    listaGuardias: any[] = [];
    listaGuardiasExcelAux:any[];
    mostrarModalGuardia: boolean = false;
    formularioGuardia: FormGroup;
    guardiaSeleccionado: any = {};
    currentState$: Observable<any>;

    // relacionador
    listaRelacionadores: any[] = [];
    listaRelacionadorExcelAux:any[];
    mostrarModalRelacionador: boolean = false;
    formularioRelacionador: FormGroup;
    relacionadorSeleccionado: any = {};


    @ViewChild("fileUpload") fileUpload: FileUpload;
    constructor(
        private storageService: StorageService,
        private anfitrionService: AnfitrionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private guardiaService: GuardiaService,
        private relacionadorService: RelacionadorService
    ) {

        this.listaMenu = [
            {
                label: "Anfitriones",
                icon: "bi bi-person-fill",
                command: (event) => {
                    this.obtenerAnfitriones();
                    this.ventanaActiva = "Anfitriones";
                },
            },
            {
                label: "Guardias",
                icon: "bi bi-shield-fill",
                command: (event) => {
                    this.obtenerGuardias();
                    this.ventanaActiva = "Guardias";
                },
            },
            {
                label: "Relacionadores",
                icon: "bi bi-megaphone-fill",
                command: (event) => {
                    this.obtenerRelacionadores();
                    this.ventanaActiva = "Relacionadores";
                },
            },
        ];
        this.ventanaActivaAux = this.listaMenu[0]
        if (this.router.getCurrentNavigation().extras.state) {
            this.ventanaActiva = this.router.getCurrentNavigation().extras.state.ventanaEnviar;
            if (this.ventanaActiva == 'Guardias'){
                this.obtenerGuardias();
                this.ventanaActivaAux = this.listaMenu[1]
            }else if (this.ventanaActiva=='Anfitriones'){
                this.obtenerAnfitriones();
                this.ventanaActivaAux = this.listaMenu[0]
            }else if (this.ventanaActiva=='Relacionadores'){
                this.ventanaActivaAux = this.listaMenu[2]
                this.obtenerRelacionadores();
            }
        }
        this.formularioAnfitrion = new FormGroup({
            nombres: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(50)]),
            apellidos: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(50)]),
            telefono: new FormControl("", [Validators.required, Validators.pattern("[- +()0-9]+"), Validators.maxLength(20)]),
            email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), Validators.maxLength(50)]),
            contrasena: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
        });

        this.formularioGuardia = new FormGroup({
            nombres: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
            apellidos: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
            telefono: new FormControl("", [Validators.required, Validators.pattern("[- +()0-9]+")]),
            usuario: new FormControl("", [Validators.required, Validators.minLength(8)]),
            contrasena: new FormControl("", [Validators.required, Validators.minLength(8)]),
        });

        this.formularioRelacionador = new FormGroup({
            nombres: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(50)]),
            apellidos: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(50)]),
            telefono: new FormControl("", [Validators.required, Validators.pattern("[- +()0-9]+"), Validators.maxLength(20)]),
            usuario: new FormControl("", [Validators.required, Validators.minLength(8)]),
            contrasena: new FormControl("", [Validators.required, Validators.minLength(8)]),
        });
    }

    ngOnInit(): void {
        this.obtenerToken();
        this.obtenerUsuario();
        this.obtenerAnfitriones();
    }
    // Anfitrion
    obtenerAnfitriones() {
        this.cargandoDatos = true;
        const id = this.obtenerUsuario().id;
        const token = this.obtenerToken();
        this.anfitrionService.obtenerAnfitriones(id, token).subscribe(
            (res: any) => {
                console.log(res);
                this.cargandoDatos = false;
                if (res.success) {
                    this.listaAnfitriones = res.data.anfitriones_hijos;
                    this.anfitrionPadre = res.data.anfitrion_padre;
                    this.listaAnfitriones.unshift(this.anfitrionPadre);
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.cargandoDatos = false;
                this.mostrarToast("error", error, "Error");
            }
        );
    }
    eliminarAnfitrion(event: Event, id: number){
        // preguntar si está seguro

        this.confirmationService.confirm({
            message: "¿Está seguro que desea eliminar este anfitrión?",
            acceptLabel: "Si",
            rejectLabel: "No",
            target: event.target,
            key: 'confirmarEliminarAnfitrion',
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.loading = true;
                const token = this.obtenerToken();
                this.anfitrionService.eliminarAnfitrion(id, token).subscribe(
                    (res: any) => {
                        this.loading = false;
                        if (res.success) {
                            this.mostrarToast("success", "Anfitrión eliminado correctamente", "Éxito");
                            this.obtenerAnfitriones();
                        } else {
                            this.mostrarToast("error", res.message, "Error");
                        }
                    },
                    (error) => {
                        this.loading = false;
                        this.mostrarToast("error", error, "Error");
                    }
                );
            }
        });
    }
    guardarAnfitrion(){
        if(this.formularioAnfitrion.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const token = this.obtenerToken();
        const anfitrion = this.formularioAnfitrion.value;
        const idPadre = this.anfitrionPadre.id;
        this.anfitrionService.agregarAnfitrion(anfitrion, idPadre, token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.mostrarToast("success", "Anfitrión guardado correctamente", "Éxito");
                    this.obtenerAnfitriones();
                    this.mostrarModalAnfitrion = false;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.loading = false;
                this.mostrarToast("error", error, "Error");
            }
        );

    }
    editarAnfitrion(){
        if(this.formularioAnfitrion.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const token = this.obtenerToken();
        const anfitrion = this.formularioAnfitrion.value;
        const imagen = this.fileUpload == undefined ? null : this.fileUpload.files[0];
        
        this.anfitrionService.editarAnfitrion(this.anfitrionSeleccionado.id, anfitrion, imagen, token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.mostrarToast("success", "Anfitrión editado correctamente", "Éxito");
                    this.obtenerAnfitriones();
                    this.mostrarModalAnfitrion = false;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.loading = false;
                this.mostrarToast("error", error, "Error");
            }
        );

    }
    modalAgregarAnfitrion(){
        // abrir modal
        this.mostrarModalAnfitrion = true;
        this.formularioAnfitrion.get('contrasena').setValidators([Validators.required, Validators.minLength(8)]);
        this.formularioAnfitrion.reset();
        this.tituloModal = "Agregar anfitrión";

    }
    modalEditarAnfitrion(anfitrion: any){
        this.mostrarModalAnfitrion = true;
        this.formularioAnfitrion.get('contrasena').setValidators(Validators.minLength(8));
        this.formularioAnfitrion.reset();
        this.tituloModal = "Editar anfitrión";
        this.formularioAnfitrion.patchValue({
            nombres: anfitrion.nombres,
            apellidos: anfitrion.apellidos,
            telefono: anfitrion.telefono,
            email: anfitrion.correo,
        });
        
        this.anfitrionSeleccionado = anfitrion;

    }
    onHideAnfitrion(event: Event){
        if(this.fileUpload !== undefined){
            this.fileUpload.clear();
        }
    }

    // Guardia
    obtenerGuardias(){
        this.cargandoDatos = true;
        const id = this.storageService.obtenerUsuario().id;
        const token = this.obtenerToken();
        this.guardiaService.obtenerGuardias(id,token).subscribe(
            (res: any) => {
                console.log(res);
                this.cargandoDatos = false;
                if (res.success) {
                    this.listaGuardias = res.data;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.cargandoDatos = false;
                this.mostrarToast("error", error, "Error");
            }
        );
    }
    eliminarGuardia(event: Event, id: number){
        // preguntar si está seguro

        this.confirmationService.confirm({
            message: "¿Está seguro que desea eliminar este guardia?",
            acceptLabel: "Si",
            rejectLabel: "No",
            target: event.target,
            key: 'confirmarEliminarGuardia',
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.loading = true;
                const token = this.obtenerToken();
                this.guardiaService.eliminarGuardia(id, token).subscribe(
                    (res: any) => {
                        this.loading = false;
                        if (res.success) {
                            this.mostrarToast("success", "Guardia eliminado correctamente", "Éxito");
                            this.obtenerGuardias();
                        } else {
                            this.mostrarToast("error", res.message, "Error");
                        }
                    },
                    (error) => {
                        this.loading = false;
                        this.mostrarToast("error", error, "Error");
                    }
                );
            }
        });
    }
    guardarGuardia(){
        if(this.formularioGuardia.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const idPadre = this.anfitrionPadre.id;
        const token = this.obtenerToken();
        const guardia = this.formularioGuardia.value;
        
        this.guardiaService.agregarGuardia(guardia, idPadre, token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.mostrarToast("success", "Guardia guardado correctamente", "Éxito");
                    this.obtenerGuardias();
                    this.mostrarModalGuardia = false;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.loading = false;
                this.mostrarToast("error", error, "Error");
            }
        );
        
    }
    editarGuardia(){
        if(this.formularioGuardia.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const token = this.obtenerToken();
        const guardia = this.formularioGuardia.value;
        this.guardiaService.editarGuardia(this.guardiaSeleccionado.id, guardia,  token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.mostrarToast("success", "Guardia editado correctamente", "Éxito");
                    this.obtenerGuardias();
                    this.mostrarModalGuardia = false;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.loading = false;
                this.mostrarToast("error", error, "Error");
            }
        );
    }
    modalAgregarGuardia(){
        // abrir modal
        this.mostrarModalGuardia = true;
        this.formularioGuardia.get('contrasena').setValidators([Validators.required, Validators.minLength(8)]);
        this.formularioGuardia.reset();
        this.tituloModal = "Agregar guardia";
    }
    modalEditarGuardia(guardia: any){
        this.mostrarModalGuardia = true;
        this.formularioGuardia.get('contrasena').setValidators(Validators.minLength(8));
        this.formularioGuardia.reset();
        this.tituloModal = "Editar guardia";
        this.formularioGuardia.patchValue({
            nombres: guardia.nombres,
            apellidos: guardia.apellidos,
            telefono: guardia.telefono,
            usuario: guardia.username
        });
        
        this.guardiaSeleccionado = guardia;
    }

    // Relacionador
    obtenerRelacionadores(){
        this.cargandoDatos = true;
        const id = this.storageService.obtenerUsuario().id;
        const token = this.obtenerToken();
        this.relacionadorService.obtenerRelacionadores(id,token).subscribe(
            (res: any) => {
                console.log(res);
                this.cargandoDatos = false;
                if (res.success) {
                    this.listaRelacionadores = res.data;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.cargandoDatos = false;
                this.mostrarToast("error", error, "Error");
            }
        );
    }
    eliminarRelacionador(event: Event, id: number){
        // preguntar si está seguro

        this.confirmationService.confirm({
            message: "¿Está seguro que desea eliminar este relacionador?",
            acceptLabel: "Si",
            rejectLabel: "No",
            target: event.target,
            key: 'confirmarEliminarRelacionador',
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.loading = true;
                const token = this.obtenerToken();
                this.relacionadorService.eliminarRelacionador(id, token).subscribe(
                    (res: any) => {
                        this.loading = false;
                        if (res.success) {
                            this.mostrarToast("success", "Relacionador eliminado correctamente", "Éxito");
                            this.obtenerRelacionadores();
                        } else {
                            this.mostrarToast("error", res.message, "Error");
                        }
                    },
                    (error) => {
                        this.loading = false;
                        this.mostrarToast("error", error, "Error");
                    }
                );
            }
        });
    }
    guardarRelacionador(){
        if(this.formularioRelacionador.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const idAnfitrion = this.anfitrionPadre.id;
        const token = this.obtenerToken();
        const relacionador = this.formularioRelacionador.value;
        
        this.relacionadorService.agregarRelacionador(relacionador, idAnfitrion, token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.mostrarToast("success", "Relacionador guardado correctamente", "Éxito");
                    this.obtenerRelacionadores();
                    this.mostrarModalRelacionador = false;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.loading = false;
                this.mostrarToast("error", error, "Error");
            }
        );
        
    }
    editarRelacionador(){
        if(this.formularioRelacionador.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const token = this.obtenerToken();
        const relacionador = this.formularioRelacionador.value;
        this.relacionadorService.editarRelacionador(this.relacionadorSeleccionado.id, relacionador, token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.mostrarToast("success", "Relacionador editado correctamente", "Éxito");
                    this.obtenerRelacionadores();
                    this.mostrarModalRelacionador = false;
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (error) => {
                this.loading = false;
                this.mostrarToast("error", error, "Error");
            }
        );
    }
    modalAgregarRelacionador(){
        // abrir modal
        this.mostrarModalRelacionador = true;
        this.formularioRelacionador.get('contrasena').setValidators([Validators.required, Validators.minLength(8)]);
        this.formularioRelacionador.reset();
        this.tituloModal = "Agregar relacionador";
    }
    modalEditarRelacionador(relacionador: any){
        this.mostrarModalRelacionador = true;
        this.formularioRelacionador.get('contrasena').setValidators(Validators.minLength(8));
        this.formularioRelacionador.reset();
        this.tituloModal = "Editar relacionador";
        this.formularioRelacionador.patchValue({
            nombres: relacionador.nombres,
            apellidos: relacionador.apellidos,
            telefono: relacionador.telefono,
            usuario: relacionador.username
        });
        this.relacionadorSeleccionado = relacionador;
    }

    obtenerToken() {
        const token = this.storageService.obtenerToken();
        return token;
    }
    obtenerUsuario() {
        const usuario = this.storageService.obtenerUsuario();
        return usuario;
    }
    mostrarToast(tipo: string, mensaje: string, titulo: string): void {
        this.messageService.add({
            severity: tipo,
            summary: titulo,
            detail: mensaje,
        });
    }
    evitarEspacios(event){
        if(event.key === " "){
            return false;
        }
        return true;
    }

    exportExcelAnfitriones() {
        this.loading = true;
        if (this.listaAnfitriones.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.listaAnfitrionesExcelAux = [];
                this.listaAnfitriones.forEach((anfitrion: any) => {
                    let aux = {
                        Nombre: anfitrion.nombres,
                        Apellidos: anfitrion.apellidos,
                        Telefono: anfitrion.telefono,
                        Correo: anfitrion.correo,
                    };
                    const finalResult = Object.assign(aux);
                    this.listaAnfitrionesExcelAux.push(finalResult);
                });
                this.generarExcelGlobal(this.listaAnfitrionesExcelAux,"Lista de anfitriones")
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.listaAnfitrionesExcelAux
                // );
                // const workbook = {
                //     Sheets: { data: worksheet },
                //     SheetNames: ["data"],
                // };
                // const excelBuffer: any = xlsx.write(workbook, {
                //     bookType: "xlsx",
                //     type: "array",
                // });
                // this.saveAsExcelFile(
                //     excelBuffer,
                //     "Lista de anfitriones"
                // );
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay anfitriones para exportar",
                "Advertencia"
            );
        }
    }   
    exportExcelGuardias() {
        this.loading = true;
        if (this.listaGuardias.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.listaGuardiasExcelAux = [];
                this.listaGuardias.forEach((guardia: any) => {
                    let aux = {
                        Nombre: guardia.nombres,
                        Apellidos: guardia.apellidos,
                        Telefono: guardia.telefono,
                        'Usuario': guardia.username,
                    };
                    const finalResult = Object.assign(aux);
                    this.listaGuardiasExcelAux.push(finalResult);
                });
                this.generarExcelGlobal(this.listaGuardiasExcelAux,"Lista de guardias")
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.listaGuardiasExcelAux
                // );
                // const workbook = {
                //     Sheets: { data: worksheet },
                //     SheetNames: ["data"],
                // };
                // const excelBuffer: any = xlsx.write(workbook, {
                //     bookType: "xlsx",
                //     type: "array",
                // });
                // this.saveAsExcelFile(
                //     excelBuffer,
                //     "Lista de guardias"
                // );
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay guardias para exportar",
                "Advertencia"
            );
        }
    }           
    exportExcelRelacionadores() {
        this.loading = true;
        if (this.listaRelacionadores.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.listaRelacionadorExcelAux = [];
                this.listaRelacionadores.forEach((relacionador: any) => {
                    let aux = {
                        Nombre: relacionador.nombres,
                        Apellidos: relacionador.apellidos,
                        Telefono: relacionador.telefono,
                        'Usuario': relacionador.username,
                    };
                    const finalResult = Object.assign(aux);
                    this.listaRelacionadorExcelAux.push(finalResult);
                });
                this.generarExcelGlobal(this.listaRelacionadorExcelAux,"Lista de relacionadores")
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.listaRelacionadorExcelAux
                // );
                // const workbook = {
                //     Sheets: { data: worksheet },
                //     SheetNames: ["data"],
                // };
                // const excelBuffer: any = xlsx.write(workbook, {
                //     bookType: "xlsx",
                //     type: "array",
                // });
                // this.saveAsExcelFile(
                //     excelBuffer,
                //     "Lista de relacionadores"
                // );
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay relacionadores para exportar",
                "Advertencia"
            );
        }
    }                   
    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
    }
    /**
     * Genera un archivo de Excel con los datos proporcionados y un título especificado.
     *
     * @param objetoDatos Un objeto con los datos que se quieren exportar a Excel.
     * @param tituloExcel El título que se le quiere dar al archivo de Excel generado.
     */    
    generarExcelGlobal(objetoDatos:any,tituloExcel) {
        const workbook = new ExcelJS.Workbook(); // Se crea un objeto Workbook de ExcelJS
        const worksheet = workbook.addWorksheet('Hoja1'); // Se agrega una hoja al Workbook
        const logo = new Image(); // Se crea un objeto Image para el logo
        logo.src = '/assets/images/logo_ventu.png'; // Se establece la ruta de la imagen
        logo.onload = () => { // Se espera a que la imagen se cargue antes de continuar
          const canvas = document.createElement('canvas'); // Se crea un objeto Canvas para dibujar la imagen
          canvas.width = logo.width; // Se establece el ancho del Canvas igual al ancho de la imagen
          canvas.height = logo.height; // Se establece la altura del Canvas igual a la altura de la imagen
          const ctx = canvas.getContext('2d'); // Se obtiene un contexto de dibujo del Canvas
          ctx.drawImage(logo, 0, 0, logo.width, logo.height); // Se dibuja la imagen en el Canvas
          const base64Image = canvas.toDataURL('image/png').split(',')[1]; // Se obtiene una representación en base64 de la imagen
          // Se agrega la imagen del logo a la hoja de Excel
          const imageId = workbook.addImage({
            base64: base64Image,
            extension: 'png',
          });
          worksheet.addImage(imageId, 'A1:C3\n');
      
          // Se agrega 4 filas vacías
          worksheet.addRow([]);
          worksheet.addRow([]);
          worksheet.addRow([]);
          worksheet.addRow([]);
      
          // Se obtienen los headers de la tabla
          const headers = Object.keys(objetoDatos[0]);
      
          // Se agregan los headers a la hoja
          worksheet.addRow(headers);
      
          // Se agregan los datos a la hoja
          objetoDatos.forEach((dato, index) => {
            const rowIndex = index + 6; // El primer dato se agrega en la fila 6
            Object.values(dato).forEach((value: string, columnIndex) => {
              const cell = worksheet.getCell(`${String.fromCharCode(columnIndex + 65)}${rowIndex}`);
              cell.value = value;
            });
          });
      
          // Se establece el estilo de la tabla
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 5) {
              row.eachCell((cell) => {
                cell.font = { bold: true };
                // cell.alignment = { horizontal: 'center' };
              });
            }
            row.eachCell((cell) => {
              cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
          });
    
          // Se guarda el archivo de Excel y se descarga
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver(blob,tituloExcel);
          });
        };
      }
}
