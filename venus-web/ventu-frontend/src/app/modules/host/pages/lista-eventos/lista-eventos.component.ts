import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService, PrimeNGConfig,ConfirmationService } from "primeng/api";
import { EventoService } from "src/app/services/evento.service";
import { PlanesService } from "src/app/services/planes.service";

import { StorageService } from "src/app/services/storage.service";
import { environment } from "src/environments/environment";
import * as FileSaver from "file-saver";
import moment from 'moment';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FileUpload } from "primeng/fileupload";
import { DatePipe } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';

import * as ExcelJS from 'exceljs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: "app-lista-eventos",
    templateUrl: "./lista-eventos.component.html",
    styleUrls: ["./lista-eventos.component.scss"],
})
export class ListaEventosComponent implements OnInit {
    cargandoDatos: boolean = false;
    usuarioId: any;
    token: string;
    listaEventos: any[] = [];
    planes:any[]=[]
    parametros_planes:any[];
    apiUrl: string = environment.API_URL;
    estado_evento: string = "Finalizado";
    
    loading: boolean;
    listaEventosExcelAux:any[];

    // creacion de evento
    @ViewChild("fileUpload") fileUpload: FileUpload;
    formularioEvento: FormGroup;
    tituloModal: string;
    urlImagen: any;
    imagen: any;
    mostrarModalEvento: boolean = false;
    mostrarModalPlanes: boolean = false;
    mostrarModalResumen: boolean = false;
    inputImagenInvalido: boolean = true;
    fechaMinima: Date = new Date();
    eventoActualizado: any = {};
    selectPago: string = "";

    opcionesTipoEvento = [
        // 'Fiesta','Matrimonio','Conferencia','Cumpleaños','Otro'
        {nombre: 'Fiesta', valor: 'Fiesta'},
        {nombre: 'Matrimonio', valor: 'Matrimonio'},
        {nombre: 'Conferencia', valor: 'Conferencia'},
        {nombre: 'Cumpleaños', valor: 'Cumpleaños'},
        {nombre: 'Otro', valor: 'Otro'} 
    ]
    opcionesPaisEvento = this.eventoService.obtenerPaises();
    opcionesPrivacidadEvento = [
        {nombre:'Público', valor:'0'},
        {nombre:'Privado', valor:'1'}
    ]
    opcionesPago = [
        {nombre:'QR o transferencia bancaria', valor:'0'},
    ]

    constructor(
        private eventoService: EventoService,
        private planesService: PlanesService,

        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private storageService: StorageService,
        private router: Router,
        private config: PrimeNGConfig,
        private datePipe: DatePipe,
        private translateService: TranslateService
    ) {
        this.eventoActualizado={
            planObjecto:{
                nombre:''
        }}
        this.formularioEvento = new FormGroup({
            nombreEvento: new FormControl("", [Validators.required, Validators.maxLength(100)]),
            descripcion: new FormControl("", [Validators.required, Validators.maxLength(350)]),
            tipo: new FormControl("", [Validators.required]),
            pais: new FormControl("", [Validators.required]),
            privacidad: new FormControl("", [Validators.required]),
            nombreLugar: new FormControl("", [Validators.maxLength(100)]),
            direccion: new FormControl("", [Validators.maxLength(100)]),
            linkMaps: new FormControl("", [Validators.maxLength(100), Validators.pattern("https://goo.gl/maps/.*")]),
            fechaInicio: new FormControl("", [Validators.required]),
            horaInicio: new FormControl("", [Validators.required]),
            fechaFin: new FormControl("", [Validators.required]),
            horaFin: new FormControl("", [Validators.required]),
        });
    }


    ngOnInit(): void {
        this.translateService.setDefaultLang('es');
        this.translate('es');
        this.cancelarEvento();
        this.obtenerUsuarioToken();
        this.cargarEventos();
        this.cargarPlanes();

    }
    
    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    }
    obtenerUsuarioToken(): void {
        this.usuarioId = this.storageService.obtenerUsuario().id;
        this.token = this.storageService.obtenerToken();
    }
    cargarEventos(): void {
        this.cargandoDatos = true;
        this.eventoService
            .listarEventos(this.token, this.usuarioId)
            .subscribe((res: any) => {
                this.cargandoDatos = false;
                console.log(res);
                if (res.success) {
                    this.listaEventos = res.data;
                    this.listaEventos.forEach((evento) => {
                        evento = this.agregarEstadoEvento(evento);
                    });
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            });
    }
    comprobarIlimitado(valor_parametro){
        if(valor_parametro==0){
            return'Ilimitado'
        }else{
            return valor_parametro
        }
    }
    cargarPlanes(): void {
        this.cargandoDatos = true;
        this.planesService
            .listarPlanes(this.token)
            .subscribe((res: any) => {
                this.cargandoDatos = false;
                if (res.success) {
                    this.planes = res.data.planes;
                    this.parametros_planes = res.data.parametros;
                    // this.listaEventos.forEach((evento) => {
                    //     evento = this.agregarEstadoEvento(evento);
                    // });
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            });
    }
    confirmarEliminar(event: Event, evento) {
            this.confirmationService.confirm({
                key: "confirmarEliminar",
                acceptLabel: "Si",
                target: event.target,
                message:
                    "¿Estás  seguro de eliminar el evento " +
                    evento.nombre +
                    "?",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                    this.eliminarEvento(evento);
                },
                reject: () => {
                    ////METODO CUANDO SE RECHAZA EL MENSAJE DE CONFIRMACION DE ELIMINAR UN INVITADO
                },
            });

    }
    eliminarEvento(evento){
        this.loading = true;
        const id = parseInt(evento.id, 10);
        this.eventoService.eliminarEvento(id, this.token,this.usuarioId).subscribe(
            (res: any) => {
                debugger

                if (res.success) {
                    this.loading = false;
                    this.cargarEventos();
                    this.mostrarToast(
                        "success",
                        "Evento eliminado.",
                        "Éxito"
                    );
                }else{
                    this.loading = false;
                    this.mostrarToast(
                        "error",
                        "Error al eliminar el evento.",
                        "Error"
                    );
                    this.cargarEventos();


                }
        })

    }
    mostrarToast(tipo: string, mensaje: string, titulo: string): void {
        this.messageService.add({
            severity: tipo,
            summary: titulo,
            detail: mensaje,
        });
    }
    formatearFecha(fecha: string) {
        fecha = this.datePipe.transform(fecha, 'dd/MM/yyyy');
        return fecha;
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

    exportExcelEventos() {
        this.loading = true;
        if (this.listaEventos.length > 0) {
            // import("xlsx").then((xlsx) => {
                this.listaEventosExcelAux = [];
                this.listaEventos.forEach((evento: any) => {
                    let tipoAux =''
                    if (evento.tipo==1){
                        tipoAux='Privado'
                    }else{
                        tipoAux='Público'
                    }
                    let dateAux = moment(evento.fecha_inicio.substr(0,10), "YYYY-MM-DD");
                    let fechaInicioAux=''
                    let fechaFinAux=''
                    fechaInicioAux=dateAux.format('DD-MM-YYYY')
                    dateAux = moment(evento.fecha_fin.substr(0,10), "YYYY-MM-DD");
                    fechaFinAux=dateAux.format('DD-MM-YYYY')
                    let aux = {
                        Nombre: evento.nombre,
                        Estado: evento.estado,
                        'Cantidad de invitados':evento.cantidad_invitados,
                        'Fecha de inicio': fechaInicioAux,
                        'Hora de inicio': evento.hora_inicio,
                        'Fecha de fin':fechaFinAux,
                        'Hora de finalización': evento.hora_fin,
                        'Nombre del lugar' : evento.nombre_lugar,
                        'Dirección ':evento.direccion,
                        'Link Ubicacion':evento.link_google,
                        'País':evento.pais,
                        'Categoría': evento.categoria,
                        'Tipo':tipoAux,
                    };
                    const finalResult = Object.assign(aux);
                    this.listaEventosExcelAux.push(finalResult);
                });
                this.generarExcelGlobal(this.listaEventosExcelAux,'Lista de eventos')
                // const worksheet = xlsx.utils.json_to_sheet(
                //     this.listaEventosExcelAux
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
                //     "Lista de eventos"
                // );
                this.loading = false;
            // });
        } else {
            this.loading = false;
            this.mostrarToast(
                "warn",
                "No hay eventos para exportar",
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
    irDetalleEvento(id: number): void {
        this.router.navigate(["/host/evento-cargado", id]);
    }

    // CREACION DE EVENTO

    modalCrearEvento(){
        this.tituloModal = "Crear evento";
        this.cancelarEvento();
        this.mostrarModalEvento = true;
    }
    obtenerEventoDesdeStorage(){
        let evento = this.storageService.obtenerEvento();
        this.imagen = this.storageService.obtenerImagenEvento();
        if(evento != null && this.imagen != null && this.imagen != undefined){
            evento.horaInicio = new Date(evento.horaInicio);
            evento.horaFin = new Date(evento.horaFin);
            evento.fechaInicio = new Date(evento.fechaInicio);
            evento.fechaFin = new Date(evento.fechaFin);
            this.formularioEvento.setValue(evento);
        }
    }
    irSegundoPaso(){
        let valoresFormularioEvento = this.formularioEvento.value;
        console.log(valoresFormularioEvento);
        if(this.formularioEvento.invalid){
            this.mostrarToast("error", "Por favor, ingrese datos válidos", "Error");
            return;
        }
        if(this.verificarFechas(valoresFormularioEvento.fechaInicio, valoresFormularioEvento.horaInicio, valoresFormularioEvento.fechaFin, valoresFormularioEvento.horaFin)){
            this.mostrarToast("error", "La fecha de finalización no puede ser igual o menor a la fecha de inicio", "Error");
            return;
        }

        this.storageService.setEvento(valoresFormularioEvento);
        this.storageService.setImagenEvento(this.urlImagen);
        this.mostrarModalEvento = false;
        this.mostrarModalPlanes = true;
    }
    seleccionarPlan(plan){
        const privacidad = this.storageService.obtenerEvento().privacidad;
        if(plan.nombre == 'Free' && privacidad == 0){
            this.mostrarToast("warn", "No puedes crear un evento público con el plan Free", "Advertencia");
            return;
        }
        let evento = this.storageService.obtenerEvento();
        evento.plan = plan.nombre;
        evento.planID = plan.id;
        evento.planObjecto = plan;
        evento.usuario = this.usuarioId;
        this.storageService.setEvento(evento);
        this.mostrarModalPlanes = false;
        this.mostrarModalResumen = true;
        this.obtenerEventoActualizado();
    }

    obtenerEventoActualizado(){
        this.eventoActualizado = this.storageService.obtenerEvento();
        this.eventoActualizado.horaInicio = this.extraerHora(this.eventoActualizado.horaInicio);
        this.eventoActualizado.horaFin = this.extraerHora(this.eventoActualizado.horaFin);
        this.eventoActualizado.fechaInicio = this.datePipe.transform(this.eventoActualizado.fechaInicio, 'dd/MM/yyyy');
        this.eventoActualizado.fechaFin = this.datePipe.transform(this.eventoActualizado.fechaFin, 'dd/MM/yyyy');
        this.imagen = this.storageService.obtenerImagenEvento();
        console.log(this.eventoActualizado);
    }

    vaciarInputImagen(event: Event){
        this.fileUpload.clear();
    }
    cargarImagenEvento(){
        const reader = new FileReader();
        reader.readAsDataURL(this.fileUpload.files[0]);
        reader.onload = () => {
        this.urlImagen = reader.result;
      };
    }

    extraerHora(hora){
        hora = this.datePipe.transform(hora, 'HH:mm');
        return hora;
    }
    verificarFechas(fechaInicio, horaInicio, fechaFin, horaFin){
        
        if(fechaInicio != '' || horaInicio != '' || fechaFin != '' || horaFin != ''){
            let fecha1  = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate(), 
            horaInicio.getHours(), horaInicio.getMinutes());
            let fecha2  = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate(),
            horaFin.getHours(), horaFin.getMinutes());
            if(fecha1 >= fecha2){
                return true;
            } 
        }
        return false;

    }

    asignarFechaMinimaHoy(){
        let fechaHoy = new Date();
        return fechaHoy;
    }

    volverPrimerPaso(){
        this.obtenerEventoDesdeStorage();
        this.mostrarModalPlanes = false;
        this.mostrarModalEvento = true;
    }
    cancelarEvento(){
        this.storageService.borrarEvento();
        this.storageService.borrarImagenEvento();
        this.formularioEvento.reset();
        this.imagen = null;
        this.urlImagen = null;
        this.mostrarModalEvento = false;
        this.mostrarModalPlanes = false;
        this.selectPago = "";
    }

    irPrimerPaso(){
        this.mostrarModalResumen = false;
        this.mostrarModalEvento = true;
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
    confirmarEvento(){
        if(this.selectPago == '' && this.loading == false){
            this.mostrarToast("error", "Por favor, seleccione un método de pago", "Error");
            return;
        }
        this.loading = true;
        this.eventoService.crearEvento(this.eventoActualizado,this.imagen, this.token).subscribe(
            (res: any) => {
                console.log(res);
                this.loading = false;
                if(res.success){
                    this.mostrarToast("success", "Evento creado correctamente", "Éxito");
                    this.mostrarModalResumen = false;
                    this.cancelarEvento();
                    this.cargarEventos();
                } else {
                    this.mostrarToast("error", res.message, "Error");
                }
            },
            (err) => {
                this.loading = false;
                this.mostrarToast("error", err, "Error");
            }
        );
    }
}
