import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-parametros-relacionador-evento',
  templateUrl: './modal-parametros-relacionador-evento.page.html',
  styleUrls: ['./modal-parametros-relacionador-evento.page.scss'],
})
export class ModalParametrosRelacionadorEventoPage implements OnInit {
  @Input() idEvento: number;
  @Input() usuarioDatos: any;
  @Input() relacionador: any;
  @Input() parametros_relacionador: any;
  @Input() invitadoAsignados: any;
  ventanaActiva:string='resumen'
  public bufferTotal = 0.01;
  public progressTotal = 0;
  totalInvitados:any
  invitadoAsignadosAux:any
  totalIngresos:any
  categorias;
  maximoInvitaciones:any
  buscadorInvitados:string=''
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.invitadoAsignadosAux = this.invitadoAsignados
  }
  atras() {
    if(this.ventanaActiva=='resumen'){
      this.modalController.dismiss();
    }else if (this.ventanaActiva=='kpis'){
      this.ventanaActiva='lista-invitados'
    }else{
      this.ventanaActiva='resumen'
      setTimeout(() => {
        let elemento = document.getElementById('ventanaResumen');
        elemento.classList.add("animate__fadeInLeft");
      }, 1);
    }
  }
  cerrarModal(){
    this.modalController.dismiss();
  }
  abrirParametrosPago(){
    console.log(this.parametros_relacionador);
    this.ventanaActiva='parametros-pago'
  }
  obtenerContadorInvitadosAsignado(categoria){
    let contador = 0
    this.invitadoAsignados.forEach((invitado: any) => {
        if (invitado.CategoriaInvitado.id ==categoria.id){
            contador+=invitado.acompanhantes+1
        }
    });
    return contador
  }
  obtenerContadorInvitadosComisionTotal(categoria,comision){
    let contador = 0
    this.invitadoAsignados.forEach((invitado: any) => {
        if (invitado.CategoriaInvitado.id ==categoria.id){
            contador+=invitado.acompanhantes+1
        }
    });
    let resultado =contador *comision
    return resultado
  }    
  obtenerTotalMaximoInvitacionesRelacionador(){
    let contador = 0
    let numero:any
    this.parametros_relacionador.forEach((parametro: any) => {
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
    this.maximoInvitaciones =contador
    return contador
  }
  obtenerComisionTotal(){
    let array_categorias = []
    let encontrado = false
    this.invitadoAsignados.forEach((invitado: any) => {
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
    this.parametros_relacionador.forEach((parametro: any) => {
      for(let y=0;y<array_categorias.length;y++){
        if (parametro.CategoriaInvitado.id ==array_categorias[y].categoria.id){
            totalComision+=array_categorias[y].contador*parametro.comision
            this.totalInvitados+=array_categorias[y].contador
        }
      }
    });
    return totalComision
  }
  abrirListaInvitadosRelacionador(){
    if(this.relacionador.contador_acompanhates!=0){
      this.ventanaActiva='lista-invitados'
    }
  }
  buscarInvitados(){
    let resultados = [];
    let busqueda = this.buscadorInvitados.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas
    // Verificar si la cadena de búsqueda no está vacía
    if(busqueda!=''&& busqueda!=' '){
      if (busqueda) {
        resultados = this.invitadoAsignados.filter(function(guardia) {
          let nombreCompleto = (guardia.nombres + " " + guardia.apellidos).toLowerCase();
          let nombre = guardia.nombres.toLowerCase();
          let apellido = guardia.apellidos.toLowerCase();
  
          // Comprobar si el nombre completo, nombre o apellido del guardia contiene la cadena de búsqueda
          return (
            nombreCompleto.includes(busqueda) ||
            nombre.includes(busqueda) ||
            apellido.includes(busqueda)
          );
        });
      }
      this.invitadoAsignados = resultados; // Actualizar la lista de guardias asignados con los resultados de la búsqueda
    }else{
      this.invitadoAsignados=this.invitadoAsignadosAux // Si la cadena de búsqueda está vacía, volver a mostrar todos los guardias asignados
    }
  }
  obtenerCategoriasKPIs() {
    // Crear un objeto vacío para almacenar las categorías y sus datos.
    const categorias = {};
    //  Crear una variable para almacenar el total de ingresos del evento.
    let total_ingresos = 0;
    // Recorrer  cada invitado en el arreglo invitadoAsignadosAux.
    this.invitadoAsignadosAux.forEach((invitado) => {
      //  Obtener la categoría del invitado.
      const categoria = invitado.CategoriaInvitado;

      // Si la categoría no existe en el objeto categorias, crear un
      // objeto con los datos de la categoría y establecer los totales en cero.
      if (!categorias[categoria.id]) {
        categorias[categoria.id] = {
          color: categoria.color,
          id: categoria.id,
          nombre: categoria.nombre,
          total_registrado: 0,
          total_ingreso: 0,
          progress:0,
          buffer:0,
        };
      }
      // Actualizar los totales de la categoría con los datos del invitado.
      categorias[categoria.id].total_registrado += invitado.acompanhantes + 1;
      categorias[categoria.id].total_ingreso += invitado.ingresos;
  
      // Actualizar el total de ingresos del evento con los datos del invitado.
      total_ingresos += invitado.ingresos;
    });
    //  Crear un arreglo a partir de los valores del objeto categorias.
    const categoriasInvitado = Object.values(categorias);
    this.categorias=categoriasInvitado
    this.totalIngresos =total_ingresos
    this.animarGraficas()
  }
  animarGraficas(){
    this.progressTotal=0
    this.bufferTotal=0
    this.bufferTotal += 0.01;
    let maximoTotal  = this.totalIngresos/this.maximoInvitaciones
    let maximoBuffer =this.relacionador.contador_acompanhates /this.maximoInvitaciones
    setTimeout(() => {
      let intervalo = setInterval(() => {
        if (this.progressTotal >= maximoTotal && this.bufferTotal >= maximoBuffer ) {
          clearInterval(intervalo);
        } else {
          if (this.bufferTotal <= maximoBuffer) {
            this.bufferTotal += 0.02;
          }
          if (this.progressTotal <= maximoTotal) {
            this.progressTotal += 0.01;
          }
        }
      }, 12);
    }, 400);
    setTimeout(() => {
      // Comenzar a animar las gráficas
      this.categorias.forEach((categoria) => {
        categoria.progress = 0;
        categoria.buffer =0
        let limiteMaximoCategoria=0
        for(let i=0;i < this.parametros_relacionador.length;i++){
          debugger
          if(this.parametros_relacionador[i].CategoriaInvitado.id==categoria.id)  
          
          limiteMaximoCategoria =this.parametros_relacionador[i].limite_invitados
        }
        let maximoBuffer = categoria.total_registrado/limiteMaximoCategoria ;
        debugger
        const maximo = categoria.total_ingreso/limiteMaximoCategoria ;
        categoria.limiteMaximoCategoria=limiteMaximoCategoria
        const intervalo = setInterval(() => {
          if (categoria.progress >= maximo && categoria.buffer >= maximoBuffer) {
            clearInterval(intervalo);
          } else {
            if (categoria.buffer <=maximoBuffer) {
              categoria.buffer += 0.02;
            }
            if (categoria.progress < maximo) {
              categoria.progress += 0.02;
            }
          }
        }, 12);
      });
    }, 400);
  }
  
  async mostrarGraficas() {
    this.obtenerTotalMaximoInvitacionesRelacionador()
    this.ventanaActiva ='kpis'
    this.obtenerCategoriasKPIs()
  }  
}
