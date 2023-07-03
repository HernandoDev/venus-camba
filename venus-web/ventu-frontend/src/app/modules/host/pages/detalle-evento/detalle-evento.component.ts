import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { StorageService } from "../../../../services/storage.service";
import { HttpClient } from '@angular/common/http';

import { EventoService } from "../../../../services/evento.service";
import { CategoriasInvitadoService } from "../../../../services/categorias-invitado.service";
import {NavigationExtras, Router} from '@angular/router';

import * as ExcelJS from 'exceljs';
import { DomSanitizer } from '@angular/platform-browser';
import * as fs from 'fs';

import * as XLSX from 'xlsx';

import * as FileSaver from "file-saver";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from "@angular/forms";
import { environment } from "../../../../../environments/environment";
import {
    MessageService,
    PrimeNGConfig,
    ConfirmationService,
} from "primeng/api";
import { MenuItem } from "primeng/api";
import QRCode from "easyqrcodejs";
import { Table } from "primeng/table";
import { ActivatedRoute } from "@angular/router";
import { FileUpload } from "primeng/fileupload";
import { Console } from "console";


@Component({
    selector: "app-detalle-evento",
    templateUrl: "./detalle-evento.component.html",
    styleUrls: ["./detalle-evento.component.scss"],
})
export class DetalleEventoComponent implements OnInit {
    @ViewChild("qrcode", { static: false }) qrcode: ElementRef;
    @ViewChild("qrcodeFake", { static: false }) qrcodeFake: ElementRef;
    @ViewChild("contenedorQR", { static: false }) contenedorQR: ElementRef;
    @ViewChild("imagenEvento", { static: false }) imagenEvento: ElementRef;
    @ViewChild("uploadExcelInvitados", { static: false }) uploadExcelInvitados: ElementRef;
    @ViewChild("dt") dt: Table | undefined;
    @ViewChild("datosQRImage", { static: false }) datosQRImage: ElementRef;
    arrayQRInvitaciones64: any[];
    usuario:any
    posicionQRWidth: any;
    uploadedFiles: any;
    posicionQRheight: any;
    formularioAgregarInvitado: FormGroup;
    invitadosAsignadosRelacionador:any;
    myfiles: any = [];
    acompanhanteSelect: any;
    asignarGuardiaFlag:boolean;
    maximoGuardias:any=0
    acompanhantesRestantes:any
    nuevaCategoriaNombre: string;
    LogoVentubase64:any;
    guardiaSeleccionado:any;
    comisionTotal:number=0;
    relacionadorSeleccionado:any;
    parametrosRelacionador:any;
    editarRelacionador :any;
    envioTodos: boolean = false;
    relacionadores :any;
    valColor = "#252434";
    totalInvitados:number=0;
    guardias:any[];
    guardiasFiltrados:any[];
    relacionadoresFiltrados:any[];
    guardiasAsignados:any[]=[]
    relacionadoresAsignados:any[]=[]
    loading: boolean;
    tamanhoQR: number = 130;
    logEnviarMensaje: string;
    background: any;
    categoriaSelecionada: any;
    mostrarModalQR2: any;
    arrayAcompanhantes: any;
    displayInsertarExcel:boolean=false;
    displayRedactarMensaje: any;
    ventanaActiva: any;
    progressBarValue: number = 0;
    evento: any = {};
    display: boolean;
    displayModalRelacionadores: boolean;
    categorias: any[] = [];
    mostrarModalQR: boolean;
    logActividades: any;
    cols: any;
    invitadoSeleccionado: any;
    enviandoMensaje: boolean;
    mostrarQR: boolean;
    cities: any;
    token: any;
    tituloModal: string;
    mensajeString: string;
    api_url = environment.API_URL;
    invitados: any[] = [];
    QRInvitacion: any;
    cargandoDatos: boolean = false;
    routeItems: MenuItem[];
    invitadoExcelAux: any[];
    guardiasExcelAux: any[];
    relacionadoresExcelAux: any[];
    idEvento: any;
    mostrarModalEvento: boolean = false;
    formularioEvento: FormGroup;
    asistentesTotal: number = 0;
    invitadosTotal: number = 0;
    porcentajeAsistentes: number = 0;
    porcentajeInvitados: number = 0;
    @ViewChild("fileUpload") fileUpload: FileUpload;
    constructor(
        private eventoService: EventoService,
        private storageService: StorageService,
        private formBuilder: FormBuilder,
        private categoriasInvitadoService: CategoriasInvitadoService,
        private router: Router,
        private messageService: MessageService,
        private sanitizer: DomSanitizer,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private http: HttpClient,
    ) {
        this.arrayQRInvitaciones64 = [];
        this.ventanaActiva = "Categorias";
        this.loading = false;
        this.posicionQRheight = 0;
        this.displayRedactarMensaje = false;
        this.posicionQRWidth = 0;
        this.enviandoMensaje = false;
        this.cols = [
            { field: "nombre", header: "Nombre" },
            { field: "categoria ", header: "Categoría " },
            { field: "whatsapp", header: "Whatsapp" },
            { field: "acompañantes", header: "Acompañantes" },
            { field: "acciones", header: "Acciones" },
        ];
        this.background =
            '#fff url("' +
            this.obtenerRutaImagenEvento() +
            '") no-repeat center center / cover';
        this.nuevaCategoriaNombre = "";
        this.logEnviarMensaje = "";
        this.arrayAcompanhantes = [
            { name: "0 acompañante/s", code: "0" },
            { name: "1 acompañante/s", code: "1" },
            { name: "2 acompañante/s", code: "2" },
            { name: "3 acompañante/s", code: "3" },
            { name: "4 acompañante/s", code: "4" },
            { name: "5 acompañante/s", code: "5" },
            { name: "6 acompañante/s", code: "6" },
            { name: "7 acompañante/s", code: "7" },
            { name: "8 acompañante/s", code: "8" },
            { name: "9 acompañante/s", code: "9" },
        ];

        this.formularioAgregarInvitado = this.formBuilder.group({
            nombres: new FormControl("", Validators.required),
            telefono: new FormControl("", Validators.required),
            apellidos: new FormControl("", Validators.required),
            acompanhantes: new FormControl(0, Validators.required),
            categoria: new FormControl(Validators.required),
            observaciones: new FormControl(""),
            observacionesGuardia: new FormControl(""),
        });

        this.formularioEvento = this.formBuilder.group({
            id: new FormControl("", Validators.required),
            nombre: new FormControl("", Validators.required),
            descripcion: new FormControl("", Validators.required),
            horaInicio: new FormControl("", Validators.required),
            horaFin: new FormControl("", Validators.required),
            nombreLugar: new FormControl("", Validators.required),
            direccion: new FormControl("", Validators.required),
            linkMaps: new FormControl(""),
        });            

        this.routeItems = [
            {
                label: "Categorías",
                icon: "pi pi-star-fill",
                command: (event) => {
                    this.ventanaActiva = "Categorias";
                    this.obtenerCategorias();
                },
            },
            {
                label: "Guardias",
                icon: "bi bi-shield-fill",
                command: (event) => {
                    this.ventanaActiva = "Guardias";
                    this.obtenerGuardias();
                },
            },
            {
                label: "Relacionadores",
                icon: "bi bi-megaphone-fill",
                command: (event) => {
                    this.ventanaActiva = "Relacionadores";
                    this.obtenerRelacionadores();
                },
            },              
            {
                label: "Invitados",
                icon: "bi bi-people-fill",
                command: (event) => {
                    this.ventanaActiva = "Invitados";
                    this.obtenerEvento();
                },
            },
            {
                label: "KPI",
                icon: "bi bi-bar-chart-fill",
                command: (event) => {
                    this.ventanaActiva = "KPI";
                    this.resetearAsistentesInvitados();
                    this.obtenerEvento();
                    this.obtenerCategorias();
                }
            }         
        ];
        this.tituloModal = "Crear invitado";
    }
    validarMaximoInvitados() {
        let maxInvitados = this.evento.cantidad_invitados;
        let cantidad = 0;
        this.invitados.forEach((invitado) => {
            cantidad += invitado.acompanhantes + 1;
        });
        this.acompanhantesRestantes=maxInvitados - cantidad
        if (maxInvitados - cantidad <= 0) {
            return true;
        } else {
            return false;
        }
    }
    refreshDatosEvento() {
        this.obtenerEvento();
        this.mostrarToast("success", "Lista de invitados actualizada", "Éxito");
        // this.messageService.add({ severity:'success', summary: 'Lista de invitados actualizada', detail: ''});
    }
    mostrarToast(tipo: string, mensaje: string, titulo: string) {
        this.messageService.add({
            severity: tipo,
            summary: titulo,
            detail: mensaje,
        });
    }
    async registratInvitado() {
        this.loading = true;
        const formularioValores = this.formularioAgregarInvitado.value;
        const invitado = {
            nombres: this.capitalizarPalabra(formularioValores.nombres),
            apellidos: this.capitalizarPalabra(formularioValores.apellidos),
            acompanhantes: parseInt(this.acompanhanteSelect, 10),
            fkcategoria: parseInt(this.categoriaSelecionada, 10),
            telefono: formularioValores.telefono,
            fk_evento: this.idEvento,
            observaciones: formularioValores.observaciones,
        };
        this.eventoService
            .agregarInvitado(invitado, this.token, this.usuario.correo)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.obtenerEvento();
                        this.display = false;
                        this.mostrarToast(
                            "success",
                            "El invitado " +
                                invitado.nombres +
                                " " +
                                invitado.apellidos +
                                '  ha sido agregado correctamente.',
                            "Éxito"
                        );
                    } else if (res.data === "Error 403, token invalido") {
                        this.display = false;
                    } else if (!res.success) {
                        this.display = false;
                    } else {
                        this.loading = false;
                        this.mostrarToast(
                            "error",
                            "Error al agregar invitado" +
                                invitado.nombres +
                                " " +
                                invitado.apellidos +
                                "",
                            "Ha ocurrido un error en el servidor"
                        );
                    }
                },
                (error) => {
                    this.loading = false;
                    this.mostrarToast(
                        "error",
                        "Error al agregar invitado" +
                            invitado.nombres +
                            " " +
                            invitado.apellidos +
                            "",
                        "Ha ocurrido un error en el servidor"
                    );
                }
            );
    }
    capitalizarPalabra(palabra) {
        if (!palabra) {
            return palabra;
        }
        palabra = palabra.trim();
        const arrayPalabra = palabra.split(" ");
        let valor = "";
        arrayPalabra.forEach((palabra) => {
            valor +=
                palabra[0].toUpperCase() +
                palabra.substr(1).toLowerCase() +
                " ";
        });
        return valor.trim();
    }
    obtenerRutaImagenEvento() {
        if (this.evento != null) {
            return this.api_url + "/" + this.evento.imagen;
        } else {
            return "";
        }
    }
    limpiarFormulario() {
        this.formularioAgregarInvitado.controls.nombres.setValue("");
        this.formularioAgregarInvitado.controls.telefono.setValue("");
        this.formularioAgregarInvitado.controls.apellidos.setValue("");
        this.formularioAgregarInvitado.controls.acompanhantes.setValue("0");
        this.formularioAgregarInvitado.controls.categoria.setValue(
            this.categorias[0].id
        );
        this.formularioAgregarInvitado.controls.observaciones.setValue("");
        this.formularioAgregarInvitado.controls.observacionesGuardia.setValue("");
        this.acompanhanteSelect = "0";
        this.categoriaSelecionada = this.categorias[0].id;
    }
    ngOnInit(): void {
        this.obtenerIdEvento();
        this.obtenerEvento();
        this.obtenerCategorias();
        this.obtenerToken()
    }
    ngAfterViewInit() {
        this.obtenerGuardias()
        this.obtenerRelacionadores();   
     }
    agregarInvitado() {
        this.formularioAgregarInvitado.controls.categoria.setValue(
            this.categorias[0].id
        );

        this.limpiarFormulario();
        this.tituloModal = "Crear invitado";
        this.mostrarQR = false;
        this.display = true;
    }    abrirQR(invitado) {
        if (invitado.acompanhantes - invitado.ingresos + 1 > 0) {
            this.formularioAgregarInvitado = this.formBuilder.group({
                nombres: new FormControl(invitado.nombres, Validators.required),
                telefono: new FormControl(
                    invitado.telefono,
                    Validators.required
                ),
                apellidos: new FormControl(
                    invitado.apellidos,
                    Validators.required
                ),
                acompanhantes: new FormControl(
                    invitado.acompanhantes.toString(),
                    Validators.required
                ),
                categoria: new FormControl(
                    invitado.CategoriaInvitado.id,
                    Validators.required
                ),
                observaciones: new FormControl(invitado.observaciones),
            });
            this.contenedorQR.nativeElement.style.display = "block";
            this.datosQRImage.nativeElement.style.display = "block";
            this.envioTodos = false;
            this.displayRedactarMensaje = false;
            this.invitadoSeleccionado = invitado;
            this.mostrarQR = true;
            this.mostrarModalQR = true;
            // this.contenedorQR.nativeElement.style.display='contents'
            this.display = false;
            this.tituloModal =
                "Ajustar QR  del invitado " +
                invitado.nombres +
                " " +
                invitado.apellidos;
            this.crearQR(invitado);
        }
    }
    abrirQRTodos() {
        this.background =
            ' url("' +
            this.obtenerRutaImagenEvento() +
            '") no-repeat left top / cover';
        this.contenedorQR.nativeElement.style.display = "block";
        this.datosQRImage.nativeElement.style.display = "block";
        let invitado = this.invitados[0];
        this.invitadoSeleccionado = invitado;
        this.envioTodos = true;
        this.displayRedactarMensaje = false;
        this.mostrarQR = true;
        this.mostrarModalQR = true;
        // this.contenedorQR.nativeElement.style.display='contents'
        this.display = false;
        this.tituloModal = "Ajustar QR  para enviarlo a todos los invitados";
        this.crearQR(invitado);
    }

    async editarInvitado() {
        const formularioValores = this.formularioAgregarInvitado.value;
        const invitado = {
            nombres: this.capitalizarPalabra(formularioValores.nombres),
            apellidos: this.capitalizarPalabra(formularioValores.apellidos),
            acompanhantes: parseInt(this.acompanhanteSelect, 10),
            fkcategoria: parseInt(this.categoriaSelecionada, 10),
            fk_evento: this.idEvento,
            observaciones: formularioValores.observaciones,
            telefono: formularioValores.telefono,
            invitado_id: this.invitadoSeleccionado.id,
        };
        let validacionAcompanhantes = true;
        if(this.invitadoSeleccionado.ingresos > 0){
            
            if ((this.invitadoSeleccionado.ingresos -1) > parseInt(this.acompanhanteSelect,10)){
                validacionAcompanhantes=false
            }
          }
        if (validacionAcompanhantes) {
            this.eventoService
                .editarInvitado(invitado, this.token, this.usuario.correo)
                .subscribe(
                    (res: any) => {
                        if (res.success) {
                            this.obtenerEvento();
                            if(this.editarRelacionador){
                                this.listarInvitadosRelacionador(this.editarRelacionador.id)
                                this.obtenerRelacionadores()
                            }
                            this.display = false;
                            this.mostrarToast(
                                "success",
                                "El invitado " +
                                    invitado.nombres +
                                    " " +
                                    invitado.apellidos +
                                    " ha sido editado correctamente",
                                "Éxito"
                            );
                        } else if (res.data === "Error 403, token invalido") {
                        } else if (!res.success) {
                            // this.mostrarToast(res.message);
                            // this.modalController.dismiss();
                        } else {
                            this.mostrarToast(
                                "error",
                                "Error al editar el invitado " +
                                    invitado.nombres +
                                    " " +
                                    invitado.apellidos,
                                "Ha ocurrido un error en el servidor"
                            );
                            this.loading = false;
                        }
                    },
                    (error) => {
        

                        this.mostrarToast(
                            "error",
                            "Error al editar el invitado " +
                                invitado.nombres +
                                " " +
                                invitado.apellidos,
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                );
        } else {
        

            this.mostrarToast(
                "warn",
                "Error al editar el invitado " +
                    invitado.nombres +
                    " " +
                    invitado.apellidos,
                "No puedes eliminar acompañantes de un invitado que ya cuenta con ingresos"
            );
            this.loading = false;
        }
    }
    listarInvitadosRelacionador(relacionadorID){
        this.loading=true
        this.eventoService.listarInvitadosRelacionadorService(relacionadorID,this.idEvento, this.token, this.usuario.correo)
        .subscribe(
            (res: any) => {
                if (res.success) {
                    this.invitadosAsignadosRelacionador=res.data.invitados
                    this.parametrosRelacionador =res.data.parametros_relacionador
                }else{

                }
            this.loading=false
            })
    }
    ActualizarDatosRelacionadorParametros(){
        this.listarInvitadosRelacionador(this.editarRelacionador.id)
        this.obtenerRelacionadores()
        this.mostrarToast(
            "success",
            "Datos del relacionador " +
                this.editarRelacionador.nombres +
                " " +
                this.editarRelacionador.apellidos +
                " actualizados.",
            "Éxito"
        );
    }
    actualizarParametro(evento,parametro){
        this.loading=true
        if (parametro.comision==null){
            parametro.comision=0
        }
        if (parametro.limite_invitados==null){
            parametro.limite_invitados=0
        }
            this.eventoService.editarParametroRelacionador(parametro,this.token, this.usuario.correo)
        .subscribe(
            (res: any) => {
                if (res.success) {
                    this.mostrarToast(
                        "success",
                        "Editado correctamente.",
                        "Éxito"
                    );
                    this.obtenerEvento()
                    this.listarInvitadosRelacionador(this.editarRelacionador.id)
                    this.obtenerRelacionadores()
                }else{

                }
            this.loading=false
            })
        
    }
    modalDetallesRelacionador(relacionador) {
        this.tituloModal =''
        this.editarRelacionador=relacionador
        this.eventoService
        this.listarInvitadosRelacionador(relacionador.id)
        this.displayModalRelacionadores = true;

 
    }
    obtenerContadorInvitadosAsignado(categoria){
        let contador = 0
        this.invitadosAsignadosRelacionador.forEach((invitado: any) => {
            if (invitado.CategoriaInvitado.id ==categoria.id){
                contador+=invitado.acompanhantes+1
            }
        });
        return contador
    }
    obtenerContadorInvitadosComisionTotal(categoria,comision){
        let contador = 0
        this.invitadosAsignadosRelacionador.forEach((invitado: any) => {
            if (invitado.CategoriaInvitado.id ==categoria.id){
                contador+=invitado.acompanhantes+1
            }
        });
        let resultado =contador *comision
        return resultado
    }    
    obtenerComisionTotal(){
        let array_categorias = []
        let encontrado = false
        this.invitadosAsignadosRelacionador.forEach((invitado: any) => {
            if (array_categorias.length<=0){
                let aux_contador =invitado.acompanhantes+1
                let aux ={
                    contador :aux_contador,
                    categoria:invitado.CategoriaInvitado
                }   
                array_categorias.push(aux)
            }else{
                let indice_aux =0
                for(let i=0;i<array_categorias.length;i++){
                    if (invitado.CategoriaInvitado.id ==array_categorias[i].categoria.id){
                        encontrado=true
                        indice_aux=i
                    }
                }
                if (encontrado==true){
                    array_categorias[indice_aux].contador+=invitado.acompanhantes+1
                }else{
                        let aux_contador =invitado.acompanhantes+1
                        let aux ={
                            contador :aux_contador,
                            categoria:invitado.CategoriaInvitado
                        }   
                        array_categorias.push(aux)
                    }
            }
        });
        let totalComision = 0
        this.totalInvitados =0
        this.parametrosRelacionador.forEach((parametro: any) => {
            for(let y=0;y<array_categorias.length;y++){
                if (parametro.CategoriaInvitado.id ==array_categorias[y].categoria.id){
                    totalComision+=array_categorias[y].contador*parametro.comision
                    this.totalInvitados+=array_categorias[y].contador
                }
            }
        
        });
        return totalComision
    }
    obtenerTotalMaximoInvitacionesRelacionador(){
        let contador = 0
        let numero:any
        this.parametrosRelacionador.forEach((parametro: any) => {
            if (parametro.limite_invitados==null || isNaN(parametro.limite_invitados) ){
                 numero=0
            }else{
             numero=parametro.limite_invitados
            }
            numero=numero.toString()
            if ( numero==''){
                numero='0'
            }
            numero=parseInt(numero);
            contador+=numero
        });
        return contador
    }
    
    modalEditarInvitado(invitado) {
        this.invitadoSeleccionado = invitado;
        this.mostrarModalQR = false;
        this.mostrarQR = false;
        this.display = true;
        ;
        this.tituloModal = "Editar invitado";
        this.categoriaSelecionada = invitado.CategoriaInvitado.id;
        this.invitadoSeleccionado = invitado;
        this.formularioAgregarInvitado = this.formBuilder.group({
            nombres: new FormControl(invitado.nombres, Validators.required),
            telefono: new FormControl(invitado.telefono, Validators.required),
            apellidos: new FormControl(invitado.apellidos, Validators.required),
            acompanhantes: new FormControl(
                invitado.acompanhantes.toString(),
                Validators.required
            ),
            categoria: new FormControl(
                invitado.CategoriaInvitado.id,
                Validators.required
            ),
            observacionesGuardia:  new FormControl(invitado.observaciones_guardia),
            observaciones: new FormControl(invitado.observaciones),
        });
        this.acompanhanteSelect=invitado.acompanhantes.toString()

    }
    toastWarning(mensaje) {
        this.mostrarToast("warn", mensaje, "Advertencia");
    }
    obtenerToken() {
        this.token = this.storageService.obtenerToken();
        this.usuario = this.storageService.obtenerUsuario();
    }

    convertirHexadecimal(str) {
        var arr = [];
        for (var i = 0; i < str.length; i++) {
            arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return "\\u" + arr.join("\\u");
    }
    convertirHexadecimaltoString(str) {
        return unescape(str.replace(/\\/g, "%"));
    }
    cambiarSizeQR(numero) {
        if (numero == 10) {
            if (this.tamanhoQR + numero <= 250) {
                this.tamanhoQR += numero;
                this.crearQR(this.invitadoSeleccionado);
            }else{
                this.mostrarToast("warn", 'No se puede seguir aumentando el tamaño del QR', "Advertencia");
            }
        } else if (numero == -10) {
            if (this.tamanhoQR + numero >= 130) {
                this.tamanhoQR += numero;
                this.crearQR(this.invitadoSeleccionado);
                this.crearQR64();
            }else{
                this.mostrarToast("warn", 'No se puede seguir reduciendo el tamaño del QR', "Advertencia");
            }
        }
        ;
    }
    moverQRWidth(numeroPortentajeMover) {
        let porcentajeQR =
            (this.tamanhoQR * 100) /
            this.imagenEvento.nativeElement.naturalWidth;
        let porcentajeRestante = 100 - porcentajeQR;
        let limiteMax =
            (this.imagenEvento.nativeElement.naturalWidth *
                porcentajeRestante) /
            103;
        if (this.datosQRImage.nativeElement.style.left == "") {
            if (numeroPortentajeMover <= 43 && numeroPortentajeMover >= 3) {
                this.datosQRImage.nativeElement.style.left =
                    numeroPortentajeMover + "px";
            }
        } else {
            let posicion = parseInt(
                this.datosQRImage.nativeElement.style.left.substring(
                    0,
                    this.datosQRImage.nativeElement.style.left.length - 2
                ),
                10
            );
            if (numeroPortentajeMover == 10) {
                if (posicion <= limiteMax) {
                    posicion += numeroPortentajeMover;
                    this.datosQRImage.nativeElement.style.left =
                        posicion + "px";
                }
            } else if (numeroPortentajeMover == -10) {
                if (posicion >= 1) {
                    posicion += numeroPortentajeMover;
                    this.datosQRImage.nativeElement.style.left =
                        posicion + "px";
                }
            }
        }
    }
    moverQRHeight(numeroPortentajeMover) {
        let porcentajeQR =
            (this.tamanhoQR * 100) /
            this.imagenEvento.nativeElement.naturalWidth;
        let porcentajeRestante = 100 - porcentajeQR;
        let limiteMax =
            (this.imagenEvento.nativeElement.naturalWidth *
                (porcentajeRestante - 25)) /
            100;
        if (this.datosQRImage.nativeElement.style.top == "") {
            if (numeroPortentajeMover <= 50 && numeroPortentajeMover >= 0) {
                this.datosQRImage.nativeElement.style.top =
                    numeroPortentajeMover + "px";
            }
        } else {
            let posicion = parseInt(
                this.datosQRImage.nativeElement.style.top.substring(
                    0,
                    this.datosQRImage.nativeElement.style.top.length - 2
                ),
                10
            );
            if (numeroPortentajeMover == 15) {
                if (posicion <= limiteMax) {
                    posicion += numeroPortentajeMover;
                    this.datosQRImage.nativeElement.style.top = posicion + "px";
                }
            } else if (numeroPortentajeMover == -15) {
                if (posicion >= 3) {
                    posicion += numeroPortentajeMover;
                    this.datosQRImage.nativeElement.style.top = posicion + "px";
                }
            }
        }
    }

    crearQR(invitado) {
        this.qrcode.nativeElement.innerHTML = "";
        let ruta = "assets/images/ventu.png";
        debugger
        let aux =parseInt(this.idEvento,10)
        let id_evento_hex = aux.toString(16);
        let nombres_invitado_hex = this.convertirHexadecimal(invitado.nombres);
        let auxInvitado =parseInt(invitado.id,10)
        let id_invitado_hex = auxInvitado.toString(16);
        let stringQR =
            id_invitado_hex + "." + nombres_invitado_hex + "." + id_evento_hex;
        let options = {
            text: stringQR,
            width: this.tamanhoQR,
            height: this.tamanhoQR,
            logoWidth: 38,
            logoHeight: 38,
            quietZone: 10,
            logo: ruta, // Relative address, relative to `easy.qrcode.mi
            logoBackgroundTransparent: true,
            onRenderingEnd: (_qrCodeOptions, base64DataFn) => {
                //  After the QR code rendering is successful ...
                this.QRInvitacion = base64DataFn;
            },
        };
        // Create new QRCode Object
        new QRCode(this.qrcode.nativeElement, options);
        if(this.datosQRImage.nativeElement.style.top=='' && this.datosQRImage.nativeElement.style.left=='' ){
            this.datosQRImage.nativeElement.style.top = this.imagenEvento.nativeElement.naturalWidth/2.5+"px";
            this.datosQRImage.nativeElement.style.left = this.imagenEvento.nativeElement.naturalWidth/2.35+"px";
        }        
    }
    crearQR64() {
        for (var i = 0; i < this.invitados.length; i++) {
            this.qrcodeFake.nativeElement.innerHTML = "";
            let ruta = "assets/images/ventu.png";
            let aux =parseInt(this.idEvento,10)
            let id_evento_hex = aux.toString(16);
            let nombres_invitado_hex = this.convertirHexadecimal(
                this.invitados[i].nombres
            );
            let auxInvitado =parseInt(this.invitados[i].id,10)
            let id_invitado_hex = auxInvitado.toString(16);
            let stringQR =
                id_invitado_hex +
                "." +
                nombres_invitado_hex +
                "." +
                id_evento_hex;
            let options = {
                text: stringQR,
                width: this.tamanhoQR,
                height: this.tamanhoQR,
                logoWidth: 38,
                logoHeight: 38,
                quietZone: 10,
                logo: ruta, // Relative address, relative to `easy.qrcode.mi
                logoBackgroundTransparent: true,
                onRenderingEnd: (_qrCodeOptions, base64DataFn, i) => {
                    //  After the QR code rendering is successful ...
                    this.arrayQRInvitaciones64.push(base64DataFn);
                },
            };
            new QRCode(this.qrcodeFake.nativeElement, options);
            this.qrcodeFake.nativeElement.innerHTML = "";
        }
    }
    obtenerCantidadMaximaGuardias(){
        this.evento.plan.asignacion_plan.forEach((parametro) => {
            if(parametro.fk_parametro==2){
                this.maximoGuardias =parametro.valor_parametro
                if (this.maximoGuardias==0){
                    this.maximoGuardias=600
                }
            }
        });

    }
    obtenerGuardias(){
            this.loading = true;
            this.obtenerCantidadMaximaGuardias()
            this.eventoService
                .obtenerGuardiasEvento(this.idEvento, this.token)
                .subscribe(
                    (res: any) => {
                        if (res.success) {
                            this.guardias = res.data.guardias;
                            this.guardiasAsignados = res.data.guardias_asignados;
                            
                            this.loading = false;
                        } else {
                            this.mostrarToast(
                                "error",
                                "Error al obtener los guardias del evento",
                                "Ha ocurrido un error en el servidor"
                            );
                            this.loading = false;
                        }
                    },
                    (error) => {
                        this.mostrarToast(
                            "error",
                            "Error al obtener los guardias del evento",
                            "Ha ocurrido un error en el servidor"
                        );
                        console.log(error);
                        this.loading = false;
                    }
                );
    }
    obtenerRelacionadores(){
        this.loading = true;
        this.eventoService
            .obtenerRelacionadoresEvento(this.idEvento, this.token)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.relacionadores = res.data.relacionadores;
                        this.relacionadoresAsignados = res.data.relacionadores_asignados;
                        this.loading = false;
                    } else {
                        this.mostrarToast(
                            "error",
                            "Error al obtener los relacionadores del evento",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al obtener los relacionadores del evento",
                        "Ha ocurrido un error en el servidor"
                    );
                    console.log(error);
                    this.loading = false;
                }
            );
}    
    obtenerEvento() {
        this.loading = true;
        this.eventoService
            .obtenerEventoPorId(this.idEvento, this.token)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.evento = res.data;
                        this.evento = this.agregarEstadoEvento(this.evento);
                        this.invitados = res.data.invitados;
                        this.loading = false;
                        
                        this.background =
                            ' url("' +
                            this.obtenerRutaImagenEvento() +
                            '") no-repeat left top / cover';
                        this.crearQR64();
                    } else {
                        this.mostrarToast(
                            "error",
                            "Error al obtener informacion del evento",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al obtener informacion del evento",
                        "Ha ocurrido un error en el servidor"
                    );
                    console.log(error);
                    this.loading = false;
                }
            );
    }
    asignarIngresosaAsistentesPorCategoria(categoria){
        categoria.asistentes = 0;
        categoria.invitados = 0;
        categoria.porcentaje = 0;
        this.invitados.forEach((invitado) => {
            debugger;
            if(invitado.CategoriaInvitado.id == categoria.id){
                categoria.asistentes += invitado.ingresos;
                categoria.invitados += invitado.acompanhantes + 1;
                categoria.porcentaje = ((categoria.asistentes / categoria.invitados) * 100);
            }
        });
        return categoria;
    }
    calcularIngresosAsistentesTotales(){
        this.categorias.forEach((categoria) => {
            this.asistentesTotal += categoria.asistentes;
            this.invitadosTotal += categoria.invitados;
        });

        this.porcentajeInvitados= ((this.invitadosTotal / this.evento.cantidad_invitados) * 100);
        this.porcentajeAsistentes = (( this.asistentesTotal / this.evento.cantidad_invitados ) * 100);

    }
    confirmarEliminarAsignacionRelacionador(event: Event, invitado){
        this.confirmationService.confirm({
            key: "confirmarEliminar",
            acceptLabel: "Si",
            target: event.target,
            message:
                "¿Estás  seguro de eliminar la asignacion del  invitado " +
                invitado.nombres +
                " " +
                invitado.apellidos +
                " con el relacionador "+this.editarRelacionador.nombres+" "+this.editarRelacionador.apellidos+"?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.eliminarAsignacionRelacionador(invitado);
            },
            reject: () => {
                ////METODO CUANDO SE RECHAZA EL MENSAJE DE CONFIRMACION DE ELIMINAR UN INVITADO
            },
        });
    }
    confirmarEliminar(event: Event, invitado) {
        if (invitado.ingresos <= 0) {
            this.confirmationService.confirm({
                key: "confirmarEliminar",
                acceptLabel: "Si",
                target: event.target,
                message:
                    "¿Estás  seguro de eliminar al invitado " +
                    invitado.nombres +
                    " " +
                    invitado.apellidos +
                    "?",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                    this.eliminarInvitado(invitado);
                },
                reject: () => {
                    ////METODO CUANDO SE RECHAZA EL MENSAJE DE CONFIRMACION DE ELIMINAR UN INVITADO
                },
            });
        } else {
            this.mostrarToast(
                "warn",
                "No se puede eliminar un invitado que ya ingresó.",
                "Advertencia"
            );
        }
    }
    confirmarEliminarGuardia(event: Event, guardia) {
            this.confirmationService.confirm({
                key: "confirmarEliminar",
                acceptLabel: "Si",
                target: event.target,
                message:
                    "¿Estás  seguro de eliminar al guardia " +
                    guardia.nombres +
                    " " +
                    guardia.apellidos +
                    "?",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                    this.eliminarAsignacionUsuario(guardia, 'guardia');
                },
                reject: () => {
                    ////METODO CUANDO SE RECHAZA EL MENSAJE DE CONFIRMACION DE ELIMINAR UN INVITADO
                },
            });
    
    }    
    confirmarEliminarRelacionador(event: Event, relacionador) {
        this.confirmationService.confirm({
            key: "confirmarEliminar",
            acceptLabel: "Si",
            target: event.target,
            message:
                "¿Estás  seguro de eliminar al relacionador " +
                relacionador.nombres +
                " " +
                relacionador.apellidos +
                "?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.eliminarAsignacionUsuario(relacionador,'relacionador');
            },
            reject: () => {
                ////METODO CUANDO SE RECHAZA EL MENSAJE DE CONFIRMACION DE ELIMINAR UN INVITADO
            },
        });

}      
exportPDFLogActividad() {
    this.loading = true;
    this.eventoService
      .obtenerLogActividad(this.idEvento, this.token)
      .subscribe((res: any) => {
        if (res.success) {
          this.logActividades = res.data;
          import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then((pdf) => {
              let y = 30;
              let x = 8;
              let saltoLineaMenor = 5;
              let saltoLineaMini = 2;
              let saltoLineaMayor = 15;
              let saltoLineaMediano = 15;
              let tabulacion = 130;
              const doc = new jsPDF.default();
              const logoImg = new Image();
              logoImg.src = '/assets/images/logo_ventu.png';
              logoImg.onload = () => {
                doc.addImage(logoImg, 'PNG', x+78, y, 40, 10);
                y += saltoLineaMayor;

                doc.setFontSize(15);
                doc.text(
                  "Reporte de actividad de " + this.evento.nombre,
                  x + 50,
                  y + 10
                );
                doc.setFontSize(10);
                y += saltoLineaMayor;
                doc.text("Actividades", x, y);
                y += saltoLineaMenor;
                doc.line(x, y, x + 180, y, "FD");
                y += saltoLineaMenor;
                doc.setFontSize(6.8);
                this.logActividades.forEach((logActividad: any) => {
                  doc.text(
                    logActividad.accion +
                    " con fecha " +
                    logActividad.fecha.substring(0, 22),
                    x,
                    y
                  );
                  y += saltoLineaMini;
                  doc.setFontSize(1.8);
                  doc.line(x, y, x + 180, y, "FD");
                  y += saltoLineaMenor;
                  doc.setFontSize(6.8);
                });
                if (this.logActividades.length > 0) {
                  var blob = doc.output("blob");
                  let w = window.open(URL.createObjectURL(blob));
              } else {
                  this.mostrarToast(
                      "warn",
                      "No hay registros de actividad para este evento",
                      "Advertencia"
                  );
              }
              this.loading = false;
              };
  
             
        });
        this.loading = false;

    });
  } else {
    this.mostrarToast(
        "error",
        "Error al generar PDF de actividad del evento",
        "Ha ocurrido un error en el servidor"
    );
    this.loading = false;
  }
  });
  }
    eliminarAsignacionRelacionador(invitado){
        this.loading = true;
        const id = parseInt(invitado.id, 10);
        this.eventoService.eliminarAsignacionInvitadoRelacionador(id, this.token, this.usuario.correo).subscribe(
            (res: any) => {
                if (res.success) {
                    this.mostrarToast("success", "Asignación eliminada", "Éxito");
                    this.listarInvitadosRelacionador(this.editarRelacionador.id)
                    this.obtenerRelacionadores()
                }else{

                }
            this.loading = false;

            },
            (error) => {
            this.loading = false;
            });
    }
    eliminarInvitado(invitado) {
        this.loading = true;
        const id = parseInt(invitado.id, 10);
        this.eventoService.eliminarInvitado(id, this.token, this.usuario.correo).subscribe(
            (res: any) => {
                if (res.success) {
                    this.obtenerEvento();
                    this.listarInvitadosRelacionador(this.editarRelacionador.id)
                    this.obtenerRelacionadores()
                    this.mostrarToast("success", "Invitado eliminado", "Éxito");
                } else {
                    this.mostrarToast(
                        "error",
                        "No se pudo eliminar al invitado" +
                            invitado.nombres +
                            " " +
                            invitado.apellidos,
                        "Ha ocurrido un error en el servidor"
                    );
                }
                this.loading = false;
            },
            (error) => {
                this.loading = false;
                this.mostrarToast(
                    "error",
                    "No se pudo eliminar al invitado" +
                        invitado.nombres +
                        " " +
                        invitado.apellidos,
                    "Ha ocurrido un error en el servidor"
                );
            }
        );
    }
    eliminarAsignacionUsuario(guardia,stringTipoUsuario) {
        this.loading = true;
        const id = parseInt(guardia.id, 10);
        this.eventoService.eliminarAsignacionUsuario(id, this.token, this.usuario.correo,this.idEvento).subscribe(
            (res: any) => {
                if (res.success) {
                    this.obtenerGuardias();
                    this.obtenerRelacionadores();
                    stringTipoUsuario=stringTipoUsuario[0].toUpperCase() + stringTipoUsuario.substring(1);
                    this.mostrarToast("success", stringTipoUsuario+" eliminado", "Éxito");
                } else {
                    this.mostrarToast(
                        "error",
                        "No se pudo eliminar al "+stringTipoUsuario +
                            guardia.nombres +
                            " " +
                            guardia.apellidos,
                        "Ha ocurrido un error en el servidor"
                    );
                }
                this.loading = false;
            },
            (error) => {
                this.loading = false;
                this.mostrarToast(
                    "error",
                    "No se pudo eliminar al "+stringTipoUsuario +
                        guardia.nombres +
                        " " +
                        guardia.apellidos,
                    "Ha ocurrido un error en el servidor"
                );
            }
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
      
      
    exportExcelInvitados() {
        this.loading = true;
        if (this.invitados.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.invitadoExcelAux = [];
                this.invitados.forEach((invitado: any) => {
                    let aux = {
                        Nombre: invitado.nombres,
                        Apellidos: invitado.apellidos,
                        Teléfono: invitado.telefono,
                        Observaciones: invitado.observaciones,
                        Categoria: invitado.CategoriaInvitado.nombre,
                        'Ingresos realizados': invitado.ingresos,
                        'Ingresos permitidos': invitado.acompanhantes+1,
                    };
                    const finalResult = Object.assign(aux);
                    this.invitadoExcelAux.push(finalResult);
                });
                this.generarExcelGlobal(this.invitadoExcelAux,"Lista de invitados de " + this.evento.nombre)
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.invitadoExcelAux
                // );
                // ///Colocar en negrita
                // worksheet["A1"].s = { font: { bold: true }};              
                // worksheet["B1"].s = { font: { bold: true }};              
                // worksheet["C1"].s = { font: { bold: true }};              
                // worksheet["D1"].s = { font: { bold: true }};              
                // worksheet["E1"].s = { font: { bold: true }};              
                // worksheet["F1"].s = { font: { bold: true }};              
                // worksheet["G1"].s = { font: { bold: true }};              
                // //INSERTAR IMAGEN

                // ///////CONTINUA EL EXCEL
                // const workbook = {
                //     Sheets: { data: worksheet },
                //     SheetNames: ["data"],
                // };
                // xlsx.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
                // const excelBuffer: any = xlsx.write(workbook, {
                //     bookType: "xlsx",
                //     type: "array",
                // });
                // this.saveAsExcelFile(
                //     excelBuffer,
                //     "Lista de invitados de " + this.evento.nombre
                // );
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay invitados para exportar",
                "Advertencia"
            );
        }
    }
    exportExcelInvitadosAsignadosRelacionador(relacionador) {
        this.loading = true;
        let totalComision = 0
        let totalIngresos = 0 
        let totalIngresosPermitidos = 0
        let comisionResultadoTotal = 0
        if (this.invitadosAsignadosRelacionador.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.invitadoExcelAux = [];
                this.invitadosAsignadosRelacionador.forEach((invitado: any) => {
                    totalComision = 0
                    for(let i =0;i<this.parametrosRelacionador.length;i++){
                        if(invitado.CategoriaInvitado.id == this.parametrosRelacionador[i].CategoriaInvitado.id ){
                            totalComision=(invitado.acompanhantes+1)* this.parametrosRelacionador[i].comision
                        }
                    }
                    let aux = {
                        Nombre: invitado.nombres,
                        Apellidos: invitado.apellidos,
                        Teléfono: invitado.telefono,
                        Observaciones: invitado.observaciones,
                        Categoria: invitado.CategoriaInvitado.nombre,
                        'Ingresos realizados': invitado.ingresos,
                        'Ingresos permitidos': invitado.acompanhantes+1,
                        Comision: totalComision,
                    };
                    totalIngresos +=invitado.ingresos
                    totalIngresosPermitidos +=(invitado.acompanhantes+1)
                    comisionResultadoTotal += totalComision
                    const finalResult = Object.assign(aux);
                    this.invitadoExcelAux.push(finalResult);
                });

                let aux = {
                    Nombre: '',
                    Apellidos:'',
                    Teléfono: '',
                    Observaciones: '',
                    Categoria: 'Total',
                    'Ingresos realizados': totalIngresos,
                    'Ingresos permitidos': totalIngresosPermitidos,
                    Comision: comisionResultadoTotal,
                };

                const finalResult = Object.assign(aux);
                this.invitadoExcelAux.push(finalResult);
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.invitadoExcelAux
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
                //     "Lista de invitados asignados a "+relacionador.nombres+' '+relacionador.apellidos +' para '+ this.evento.nombre
                // );
                this.generarExcelGlobal(this.invitadoExcelAux,"Lista de invitados asignados a "+relacionador.nombres+' '+relacionador.apellidos +' para '+ this.evento.nombre)
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay invitados para exportar",
                "Advertencia"
            );
        }
    }
    exportExcelRelacionadores() {
        this.loading = true;
        if (this.relacionadoresAsignados.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.relacionadoresExcelAux = [];
                this.relacionadoresAsignados.forEach((relacionador: any) => {
                    let aux = {
                        Nombre: relacionador.nombres,
                        Apellidos: relacionador.apellidos,
                        Teléfono: relacionador.telefono,
                        Usuario: relacionador.username,
                    };
                    const finalResult = Object.assign(aux);
                    this.relacionadoresExcelAux.push(finalResult);
                });
                this.generarExcelGlobal(this.relacionadoresExcelAux,"Lista de relacionadores de " + this.evento.nombre)
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.relacionadoresExcelAux
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
                //     "Lista de relacionadores de " + this.evento.nombre
                // );
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay relacionadores asignados al evento para exportar",
                "Advertencia"
            );
        }
    }        
    exportExcelGuardias() {
        this.loading = true;
        if (this.guardiasAsignados.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.guardiasExcelAux = [];
                this.guardiasAsignados.forEach((guardia: any) => {
                    let aux = {
                        Nombre: guardia.nombres,
                        Apellidos: guardia.apellidos,
                        Teléfono: guardia.telefono,
                        Usuario: guardia.username,
                    };
                    const finalResult = Object.assign(aux);
                    this.guardiasExcelAux.push(finalResult);
                });
                //    
                this.generarExcelGlobal(this.guardiasExcelAux, "Lista de guardias de " + this.evento.nombre)
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.guardiasExcelAux
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
                //     "Lista de guardias de " + this.evento.nombre
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
    ocultarContenedorQR() {
        if (this.envioTodos) {
            this.tituloModal =
                "Redactar un mensaje para enviarlo junto la invitación";
        } else {
            this.tituloModal =
                "Redactar un mensaje para " +
                this.invitadoSeleccionado.nombres +
                " " +
                this.invitadoSeleccionado.apellidos;
        }
        this.contenedorQR.nativeElement.style.display = "none";
        this.datosQRImage.nativeElement.style.display = "none";

        this.displayRedactarMensaje = true;
    }
    mostrarContenedorQR() {
        this.background =
            '#fff url("' +
            this.obtenerRutaImagenEvento() +
            '") no-repeat center center / cover';
        if (this.envioTodos) {
            this.tituloModal =
                "Ajustar QR  para enviarlo a todos los invitados";
        } else {
            this.tituloModal =
                "Ajustar QR  del invitado " +
                this.invitadoSeleccionado.nombres +
                " " +
                this.invitadoSeleccionado.apellidos;
        }
        this.contenedorQR.nativeElement.style.display = "block";
        this.datosQRImage.nativeElement.style.display = "block";

        this.displayRedactarMensaje = false;
    }
    async aumentarProgreso(limite, log) {
        if (this.progressBarValue < limite) {
            this.progressBarValue += 1;
            this.logEnviarMensaje = log;
            setTimeout(() => this.aumentarProgreso(limite, log), 150);
        }
    }
    envioQRTodos() {
        for (var i = 0; i < this.invitados.length; i++) {
            this.invitados[i].base64QR = this.arrayQRInvitaciones64[i];
        }

        this.progressBarValue = 0;
        this.enviandoMensaje = true;
        if (this.mensajeString == null || this.mensajeString == "") {
            this.mensajeString = " ";
        }
        this.aumentarProgreso(50, "Generando invitaciones...");
        let widthAux = parseInt(
            this.datosQRImage.nativeElement.style.left.substring(
                0,
                this.datosQRImage.nativeElement.style.left.length - 1
            ),
            10
        );
        let heightAux = parseInt(
            this.datosQRImage.nativeElement.style.top.substring(
                0,
                this.datosQRImage.nativeElement.style.top.length - 1
            ),
            10
        );

        this.eventoService
            .enviarQRIndividualTodos(
                widthAux,
                heightAux,
                this.mensajeString,
                this.invitados,
                this.evento,
                this.token,
                this.tamanhoQR
            )
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.progressBarValue = 51;
                        this.aumentarProgreso(99, "Enviando mensajes...");
                        this.eventoService
                            .mandarMensajeIndividualWhatsappTodos(
                                res.data,
                                this.mensajeString
                            )
                            .subscribe(
                                (res: any) => {
                                    
                                    // if(res.responseExSave.id=='error'){
                                    // this.messageService.add({ severity:'error', summary: 'Error al mandar el mensaje', detail:'El número no es válido.' });
                                    // this.enviandoMensaje=false
                                    // }else{
                                    this.progressBarValue = 100;
                                    this.enviandoMensaje = false;
                                    this.mostrarToast(
                                        "success",
                                        "Mensaje/s enviado/s",
                                        "Éxito"
                                    );
                                    this.mostrarModalQR = false;
                                    // }
                                },
                                (error) => {
                                    // ERRROR  CON EL BACKEND DE VENTU
                                    this.mostrarToast(
                                        "error",
                                        "Error al mandar el mensaje",
                                        "Ha ocurrido un error en el servidor"
                                    );
                                    
                                    this.enviandoMensaje = false;
                                }
                            );
                    } else {
                        this.mostrarToast(
                            "error",
                            "Error al mandar el mensaje",
                            "Ha ocurrido un error en el servidor"
                        );
                        
                        this.enviandoMensaje = false;
                    }
                },
                (error) => {
                    // ERRROR  CON EL BACKEND DE VENTU
                    this.mostrarToast(
                        "error",
                        "Error al mandar el mensaje",
                        "Ha ocurrido un error en el servidor"
                    );
                    
                    this.enviandoMensaje = false;
                }
            );
    }
    enviarQRIndividual() {
        

        this.progressBarValue = 0;
        this.enviandoMensaje = true;
        if (this.mensajeString == null || this.mensajeString == "") {
            this.mensajeString = " ";
        }
        this.aumentarProgreso(50, "Generando invitaciones...");
        let widthAux = parseInt(
            this.datosQRImage.nativeElement.style.left.substring(
                0,
                this.datosQRImage.nativeElement.style.left.length - 1
            ),
            10
        );
        let heightAux = parseInt(
            this.datosQRImage.nativeElement.style.top.substring(
                0,
                this.datosQRImage.nativeElement.style.top.length - 1
            ),
            10
        );
        this.eventoService
            .enviarQRIndividual(
                widthAux,
                heightAux,
                this.mensajeString,
                this.invitadoSeleccionado,
                this.evento,
                this.QRInvitacion,
                this.token,
                this.tamanhoQR
            )
            .subscribe(
                (res: any) => {
                    

                    if (res.success) {
                        this.progressBarValue = 51;
                        this.aumentarProgreso(99, "Enviando mensajes...");
                        this.eventoService
                            .mandarMensajeIndividualWhatsapp(
                                res.data.message,
                                res.data.phone,
                                res.data.url_imagen
                            )
                            .subscribe(
                                (res: any) => {
                                    

                                    if (res.responseExSave.id == "error") {
                                        this.mostrarToast(
                                            "error",
                                            "Error al mandar el mensaje",
                                            "El número no es válido."
                                        );
                                        this.enviandoMensaje = false;
                                        
                                    } else {
                                        this.progressBarValue = 100;
                                        this.enviandoMensaje = false;
                                        this.mostrarToast(
                                            "success",
                                            "Mensaje/s enviado/s",
                                            "Éxito"
                                        );
                                        this.mostrarModalQR = false;
                                    }

                                    // if (res.success) {
                                    // }else{
                                    // //ERROR AL ENVIAR MENSAJE POR WHATSAPP
                                    // }
                                },
                                (error) => {
                                    //ERROR AL ENVIAR MENSAJE POR WHATSAPP
                                    this.mostrarToast(
                                        "error",
                                        "Error al mandar el mensaje",
                                        "Ha ocurrido un error en el servidor"
                                    );
                                    

                                    this.enviandoMensaje = false;
                                }
                            );
                    } else if (res.data === "Error 403, token invalido") {
                        // ERRROR DE TOKEN AL CONECTARSE CON EL BACKEND DE VENTU
                        this.mostrarToast(
                            "error",
                            "Error al mandar el mensaje",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.enviandoMensaje = false;
                        

                    } else if (!res.success) {
                        // ERRROR  CON EL BACKEND DE VENTU
                        this.mostrarToast(
                            "error",
                            "Error al mandar el mensaje",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.enviandoMensaje = false;
                    } else {
                        // ERRROR  CON EL BACKEND DE VENTU
                        this.mostrarToast(
                            "error",
                            "Error al mandar el mensaje",
                            "Ha ocurrido un error en el servidor"
                        );
                        

                        this.enviandoMensaje = false;
                    }
                },
                (error) => {
                    // ERRROR  CON EL BACKEND DE VENTU
                    this.mostrarToast(
                        "error",
                        "Error al mandar el mensaje",
                        "Ha ocurrido un error en el servidor"
                    );
                    

                    this.enviandoMensaje = false;
                }
            );
    }

    confirmarEliminarCategoria(event: Event, categoria) {
        this.confirmationService.confirm({
            key: "confirmarEliminarCategoria",
            target: event.target,
            acceptLabel: "Si",
            message:
                "¿Estás seguro de eliminar la categoría " +
                categoria.nombre +
                "?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.eliminarCategoria(categoria);
            },
            reject: () => {
                ////METODO CUANDO SE RECHAZA EL MENSAJE DE CONFIRMACION DE ELIMINAR UN CATEGORIAS
            },
        });
    }
    eliminarCategoria(categoria) {
        this.loading = true;
        this.categoriasInvitadoService
            .eliminarCategoria(categoria.id, this.token)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.obtenerCategorias();
                        this.obtenerEvento();
                        this.mostrarToast(
                            "success",
                            "La categoría " +
                                categoria.nombre +
                                " ha sido eliminada  correctamente",
                            "Éxito"
                        );
                        this.loading = false;
                    } else {
                        this.mostrarToast(
                            "error",
                            res.message,
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al eliminar la  categoría",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }
    editarCategoria(categoria) {
        this.loading = true;
        this.categoriasInvitadoService
            .editarCategoria(categoria, this.token)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.obtenerCategorias();
                        this.obtenerEvento();
                        this.mostrarToast(
                            "success",
                            "La categoría " +
                                categoria.nombre +
                                " ha sido editada  correctamente",
                            "Éxito"
                        );
                        this.loading = false;
                    } else {
                        this.mostrarToast(
                            "error",
                            "Error al editar la  categorías",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al editar la  categorías",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }

    obtenerCategorias() {
        this.loading = true;
        this.categoriasInvitadoService
            .obtenerCategorias(this.idEvento, this.token)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.categorias = res.data;
                        this.categorias.forEach((categoria) => {
                            categoria = this.asignarIngresosaAsistentesPorCategoria(categoria);
                        });
                        console.log(this.categorias);
                        this.calcularIngresosAsistentesTotales();
                        this.loading = false;
                    } else {
                        this.mostrarToast(
                            "error",
                            "Error al obtener las  categorías",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al obtener las  categorías",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }

    agregarCategoria() {
        this.loading = true;
        this.categoriasInvitadoService
            .insertarCategoria(
                this.valColor,
                this.nuevaCategoriaNombre,
                this.token,
                this.idEvento
            )
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.obtenerCategorias();
                        // this.obtenerEvento()
                        this.mostrarToast(
                            "success",
                            "Categoría insertada correctamente",
                            "Éxito"
                        );
                        this.nuevaCategoriaNombre=''
                        this.valColor='#252434'
                        this.loading = false;
                    } else {
                        this.mostrarToast(
                            "error",
                            "Error al insertar categoría",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al insertar categoría",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }
    obtenerIdEvento() {
        this.activatedRoute.params.subscribe((params) => {
            this.idEvento = params["id"];
        });
    }
    formatearFecha(fecha: string) {
        // formatear por dd/mm/yyyy
        const fechaFormateada = new Date(fecha);
        const dia = fechaFormateada.getDate();
        const mes = fechaFormateada.getMonth() + 1;
        const anio = fechaFormateada.getFullYear();

        if(mes < 10){
            return dia + "/0" + mes + "/" + anio;
        }
        return dia + "/" + mes + "/" + anio;
    }

    formatearTipoEvento(tipo: number): string {
        if (tipo === 0) {
            return "Público";
        } else if (tipo === 1) {
            return "Privado";
        } else {
            return "";
        }
    }

    agregarEstadoEvento(evento: any) {
        let fechaHoy = new Date();
        let fechaYHoraInicio = new Date(evento.fecha_inicio)
        let fechaYHoraFin = new Date(evento.fecha_fin)
        // asignarle la hora y los minutos
        fechaYHoraInicio.setHours(evento.hora_inicio.split(':')[0], evento.hora_inicio.split(':')[1])
        fechaYHoraFin.setHours(evento.hora_fin.split(':')[0], evento.hora_fin.split(':')[1])

        if(fechaHoy < fechaYHoraInicio){
            evento.estado = "Pendiente";
        } else if(fechaHoy >= fechaYHoraInicio && fechaHoy <= fechaYHoraFin){
            evento.estado = "En curso";
        } else if(fechaHoy > fechaYHoraFin){
            evento.estado = "Finalizado";
        }
        return evento
    }

    filtrarGuardia(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.guardias.length; i++) {
            const guardia = this.guardias[i];
            let nombre_apellidos  = guardia.nombres+ ' ' + guardia.apellidos
            if (guardia.nombres.toLowerCase().indexOf(query.toLowerCase()) == 0 || 
                guardia.apellidos.toLowerCase().indexOf(query.toLowerCase()) == 0 ||
                guardia.username.toLowerCase().indexOf(query.toLowerCase()) == 0 ||
                nombre_apellidos.toLowerCase().indexOf(query.toLowerCase()) == 0 
            ) {
                filtered.push(guardia);
            }
        }

        this.guardiasFiltrados = filtered;
    }
    filtrarRelacionador(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.relacionadores.length; i++) {
            const relacionador = this.relacionadores[i];
            let nombre_apellidos  = relacionador.nombres+ ' ' + relacionador.apellidos
            if (relacionador.nombres.toLowerCase().indexOf(query.toLowerCase()) == 0 || 
                relacionador.apellidos.toLowerCase().indexOf(query.toLowerCase()) == 0 ||
                relacionador.username.toLowerCase().indexOf(query.toLowerCase()) == 0 ||
                nombre_apellidos.toLowerCase().indexOf(query.toLowerCase()) == 0 
            ) {
                filtered.push(relacionador);
            }
        }

        this.relacionadoresFiltrados = filtered;
    }    
    asignarRelacionador(relacionador: any){
        this.loading = true;
        this.eventoService
        .asignarRelacionador(
            relacionador,
            this.token,
            this.usuario.correo,
            this.idEvento
        )
        .subscribe(
            (res: any) => {
                if (res.success) {
                    this.obtenerRelacionadores()
                    this.loading = false;
                    this.mostrarToast(
                        "success",
                        "Relacionador asignado correctamente",
                        "Éxito"
                    );
                    this.asignarGuardiaFlag=false
                } else {
                        this.mostrarToast(
                            "error",
                            "Error al asignar al relacionador.",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al asignar al relacionador.",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }    
    asignarGuardia(guardia: any){
        this.loading = true;
        this.eventoService
        .asignarGuardia(
            guardia,
            this.token,
            this.usuario.correo,
            this.idEvento
        )
        .subscribe(
            (res: any) => {
                if (res.success) {
                    this.obtenerGuardias()
                    this.loading = false;
                    this.mostrarToast(
                        "success",
                        "Guardia asignado correctamente",
                        "Éxito"
                    );
                    this.asignarGuardiaFlag=false
                } else {
                        this.mostrarToast(
                            "error",
                            "Error al asignar al guardia.",
                            "Ha ocurrido un error en el servidor"
                        );
                        this.loading = false;
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al asignar al guardia.",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }
    limpiarUpload(){
        this.uploadedFiles=null
        debugger

    }
    modalExcelImportarInvitados(){
        this.tituloModal = 'Carga de invitados con excel'
        this.displayInsertarExcel = true
        this.myfiles = [];
        this.uploadedFiles=null


    }
    myUploader(event: {files: FormData[]}) {
        this.uploadedFiles = event.files[0];
    }
    cargarInvitados(){
        this.loading = true;
        this.eventoService
        .insertarInvitadosExcel(
            this.idEvento,
            this.token,
            this.uploadedFiles,
            this.acompanhantesRestantes
        )
        .subscribe(
            (res: any) => {
                if (res.success) {
                    this.mostrarToast(
                        "success",
                        res.message,
                        'Éxito',
                    );
                    this.loading = false;
                    this.displayInsertarExcel=false 
                    this.obtenerEvento()

                } else {
                    let string_error =''
                    for(let i =0;i<=res.data.length;i++){
                        if (res.data[i]!=null){
                            string_error += res.data[i]+'\n'
                        }

                    }
                        this.mostrarToast(
                            "error",
                            string_error,
                            res.message,
                        );
                        this.loading = false;
                        this.obtenerEvento()
                    }
                },
                (error) => {
                    this.mostrarToast(
                        "error",
                        "Error al insertar invitados mediante excel.",
                        "Ha ocurrido un error en el servidor"
                    );
                    this.loading = false;
                }
            );
    }
    abrirModalEditarEvento(evento){;
        this.tituloModal = 'Editar evento';
        this.mostrarModalEvento = true;
        this.formularioEvento.patchValue({
            id: evento.id,
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            horaInicio: evento.hora_inicio,
            horaFin: evento.hora_fin,
            direccion: evento.direccion,
            nombreLugar: evento.nombre_lugar,
            linkMaps: evento.link_google,
        });
    }
    editarEvento(){
        //debugger;
        if(this.formularioEvento.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        this.loading = true;
        const evento = this.formularioEvento.value;
        const imagen = this.fileUpload == undefined ? null : this.fileUpload.files[0];
        let eventoAnterior = this.evento;
        eventoAnterior.fecha_inicio = this.formatearFecha(eventoAnterior.fecha_inicio).split('T')[0];
        eventoAnterior.fecha_fin = this.formatearFecha(eventoAnterior.fecha_fin).split('T')[0];
        
        if(this.calcularFechas(eventoAnterior.fecha_inicio, evento.horaInicio, eventoAnterior.fecha_fin, evento.horaFin)){
            this.mostrarToast("error", "La fecha de inicio no puede ser mayor a la fecha de fin", "Error");
            this.loading = false;
            this.obtenerEvento();
            return;
        }
        
        this.eventoService.editarEvento(evento, eventoAnterior, imagen, this.token).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.obtenerEvento();
                    this.mostrarToast("success", "Evento editado correctamente", "Éxito");
                    this.mostrarModalEvento = false;
                } else {
                    this.mostrarToast("error", "Error al editar el evento", "Error");
                }
            },
            (error: any) => {
                this.mostrarToast("error", error, "Error");
                this.loading = false;
            }
        );

    }
    irPersonal(tipoPersonal){
        const parametrosEnviar = { 
            state:{ 
                ventanaEnviar:tipoPersonal
            }
        }
        this.router.navigate(['/host/personal'], parametrosEnviar);
    }
    calcularFechas(fechaInicio, horaInicio, fechaFin, horaFin){
        let inicio = new Date(fechaInicio.split("/")[2] + "-" + fechaInicio.split("/")[1] + "-" + fechaInicio.split("/")[0]);
        inicio.setHours(horaInicio.split(":")[0], horaInicio.split(":")[1]);
        let fin = new Date(fechaFin.split("/")[2] + "-" + fechaFin.split("/")[1] + "-" + fechaFin.split("/")[0]);
        fin.setHours(horaFin.split(":")[0], horaFin.split(":")[1]);

        if(inicio > fin){
            return true;
        }
        return false;

    }
    resetearAsistentesInvitados(){
        this.invitadosTotal = 0;
        this.asistentesTotal = 0;
    }
}
