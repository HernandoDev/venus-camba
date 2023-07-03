import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private api = environment.API_URL;
  private apiBOT = environment.BOT_URL;
  private listaPaises = [
    'Afganistán',
    'Albania',
    'Alemania',
    'Andorra',
    'Angola',
    'Antigua y Barbuda',
    'Arabia Saudita',
    'Argelia',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaiyán',
    'Bahamas',
    'Bangladés',
    'Barbados',
    'Baréin',
    'Bélgica',
    'Belice',
    'Benín',
    'Bielorrusia',
    'Birmania',
    'Bolivia',
    'Bosnia-Herzegovina',
    'Botsuana',
    'Brasil',
    'Brunéi',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Bután',
    'Cabo',
    'Camboya',
    'Camerún',
    'Canadá',
    'Catar',
    'Chad',
    'Chile',
    'China',
    'Chipre',
    'Colombia',
    'Comoras',
    'Congo',
    'Corea del Norte',
    'Corea del Sur',
    'Costa de Marfil',
    'Costa Rica',
    'Croacia',
    'Cuba',
    'Dinamarca',
    'Dominica',
    'Ecuador',
    'Egipto',
    'El Salvador',
    'Emiratos Árabes Unidos',
    'Eritrea',
    'Eslovaquia',
    'Eslovenia',
    'España',
    'Estados Unidos',
    'Estonia',
    'Esuatini',
    'Etiopía',
    'Filipinas',
    'Finlandia',
    'Fiyi',
    'Francia',
    'Gabón',
    'Gambia',
    'Georgia',
    'Ghana',
    'Granada',
    'Grecia',
    'Guatemala',
    'Guinea',
    'Guinea Ecuatorial',
    'Guinea-Bisáu',
    'Guyana',
    'Haití',
    'Honduras',
    'Hungría',
    'India',
    'Indonesia',
    'Irak',
    'Irán',
    'Irlanda',
    'Islandia',
    'Islas Marshall',
    'Islas Salomón',
    'Israel',
    'Italia',
    'Jamaica',
    'Japón',
    'Jordania',
    'Kazajistán',
    'Kenia',
    'Kirguistán',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Laos',
    'Lesoto',
    'Letonia',
    'Líbano',
    'Liberia',
    'Libia',
    'Liechtenstein',
    'Lituania',
    'Luxemburgo',
    'Macedonia del Norte',
    'Madagascar',
    'Malasia',
    'Malaui',
    'Maldivas',
    'Malí',
    'Malta',
    'Marruecos',
    'Mauricio',
    'Mauritania',
    'México',
    'Micronesia',
    'Moldavia',
    'Mónaco',
    'Mongolia',
    'Montenegro',
    'Mozambique',
    'Namibia',
    'Nauru',
    'Nepal',
    'Nicaragua',
    'Níger',
    'Nigeria',
    'Noruega',
    'Nueva Zelanda',
    'Omán Mascate',
    'Países Bajos',
    'Pakistán',
    'Palaos',
    'Palestina',
    'Panamá',
    'Papúa Nueva Guinea',
    'Paraguay',
    'Perú',
    'Polonia',
    'Portugal',
    'Reino Unido',
    'República Centroafricana',
    'República Checa',
    'República Democrática del Congo',
    'República Dominicana',
    'Ruanda',
    'Rumania',
    'Rusia',
    'Samoa',
    'San Cristóbal y Nieves',
    'San Marino',
    'San Vicente y las Granadinas',
    'Santa Lucía',
    'Santo Tomé y Príncipe',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leona',
    'Singapur',
    'Siria',
    'Somalia',
    'Sri Lanka',
    'Sudáfrica',
    'Sudán\tJartum',
    'Sudán del Sur',
    'Suecia',
    'Suiza',
    'Surinam',
    'Tailandia',
    'Taiwán',
    'Tanzania',
    'Tayikistán',
    'Timor Oriental',
    'Togo',
    'Tonga',
    'Trinidad y Tobago',
    'Túnez',
    'Turkmenistán',
    'Turquía',
    'Tuvalu',
    'Ucrania',
    'Uganda',
    'Uruguay',
    'Uzbekistán',
    'Vanuatu',
    'Vaticano',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Yibuti',
    'Zambia',
    'Zimbabue',
  ];

  constructor(private http: HttpClient,) { 

  }

  listarEventos(token: string, usuario: number) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };

    const ruta = `${this.api}/evento/listar`;
    return this.http.post(ruta, usuario, headers);
  }
  editarEvento(evento: any, eventoAnterior: any, imagen, token: string){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/editar`;
    const body = {
        id: evento.id,
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        hora_inicio: evento.horaInicio,
        hora_fin: evento.horaFin,
        nombre_lugar: evento.nombreLugar,
        direccion: evento.direccion,
        link_google: evento.linkMaps,
        //datos del evento sin editar
        fecha_inicio: eventoAnterior.fecha_inicio.split('T')[0],
        fecha_fin: eventoAnterior.fecha_fin.split('T')[0],
        tipo: eventoAnterior.tipo,
        categoria: eventoAnterior.categoria,
        cantidad_invitados: eventoAnterior.cantidad_invitados,
    }
    let formData = new FormData();
    formData.append("body", JSON.stringify(body));
    if(imagen != null && imagen != undefined){
      formData.append("imagen", imagen, imagen.name);
    }
    console.log(body);
    return this.http.put(ruta, formData, headers);

  }
  obtenerEventoPorId(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/` + id;
    return this.http.get(ruta, headers);
  }
  obtenerGuardiasEvento(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/obtener_guardias_evento/` + id;
    return this.http.get(ruta, headers);
  }  
  obtenerRelacionadoresEvento(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/obtener_relacionadores_evento/` + id;
    return this.http.get(ruta, headers);
  }    
  obtenerLogActividad(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/obtener_bitacora_evento/` + id;
    return this.http.get(ruta, headers);
  }
  eliminarInvitado(id: number, token,correo) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/lista_invitados/eliminar`;
    let body = {
      correo:correo ,
      id:id
    }
    return this.http.post(ruta,body, headers);
  }
  eliminarEvento(id: number, token,id_usuario) {
    // const headers = {
    //   headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    // };
    // const ruta = `${this.api}/evento/eliminar_evento`;
    // let body = {
    //   id:id,
    //   id_usuario:id_usuario
    // }
    // return this.http.post(ruta,body, headers);
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/` + id;
    return this.http.delete(ruta, headers);
  }  
  eliminarAsignacionInvitadoRelacionador(id: number, token,correo) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/lista_invitados/eliminar_asignacion_invitado_relacionador`;
    let body = {
      correo:correo ,
      id:id
    }
    return this.http.post(ruta,body, headers);
  }  

  eliminarAsignacionUsuario(id: number, token,correo,id_evento) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/eliminar_asignacion_usuario`;
    let body = {
      correo:correo ,
      id:id,
      id_evento:id_evento
    }
    return this.http.post(ruta,body, headers);
  }  
  agregarInvitado(invitado, token,correo) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      correo:correo ,
      invitado:invitado
    }
    const ruta = `${this.api}/lista_invitados/insertar`;
    return this.http.post(ruta, body, headers);
  }

  asignarGuardia(guardia, token,correo,id_evento) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      correo:correo ,
      guardia:guardia,
      id_evento
    }
    const ruta = `${this.api}/evento/asignar_guardia`;
    return this.http.post(ruta, body, headers);
  }
  asignarRelacionador(relacionador, token,correo,id_evento) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      correo:correo ,
      relacionador:relacionador,
      id_evento
    }
    const ruta = `${this.api}/evento/asignar_relacionador`;
    return this.http.post(ruta, body, headers);
  }  
  insertarInvitadosExcel(id_evento,token,file,acompanhantesRestantes){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      id_evento,
      file,
      acompanhantesRestantes
    }
    const ruta = `${this.api}/lista_invitados/insertar_excel`;
    let formData = new FormData();
    formData.append("body", JSON.stringify(body));
    formData.append("excel", file, file.name);
    return this.http.post(ruta, formData, headers);
  }


  enviarQRIndividual(width,height,mensaje, invitado,evento,QRInvitacion64,token,tamanhoQR) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      width:width ,
      height:height,
      mensaje:mensaje,
      invitado:invitado,
      QRInvitacion64:QRInvitacion64,
      evento:evento,
      tamanhoQR:tamanhoQR,
      api_url:this.api,

    }
    const ruta = `${this.api}/lista_invitados/concatenar_qr_evento`;
    return this.http.post(ruta, body, headers);
  }
  
  enviarQRIndividualTodos(width,height,mensaje, invitados,evento,token,tamanhoQR) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      width:width ,
      height:height,
      mensaje:mensaje,
      invitados:invitados,
      evento:evento,
      tamanhoQR:tamanhoQR,
      api_url:this.api,

    }
    const ruta = `${this.api}/lista_invitados/concatenar_qr_evento_todos`;
    return this.http.post(ruta, body, headers);
  }
  mandarMensajeIndividualWhatsapp(mensaje,telefono,url_imagen){
    const url_imagenFinal = this.api+url_imagen;
    let body = {
      message:mensaje,
      phone:parseInt(telefono,10),
      url_imagen:url_imagenFinal,
      api_url:this.api,

    }
    const ruta = this.apiBOT+`/lead`;
    
    return this.http.post(ruta, body);
  }
  mandarMensajeIndividualWhatsappTodos(invitados,mensaje){
    let body = {
      invitados:invitados,
      message:mensaje,
      api_url:this.api,
    }
    const ruta = this.apiBOT+`/lead/lead_todos`;
    return this.http.post(ruta, body);
  }

  editarInvitado(invitado, token,correo) {
    
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      correo:correo ,
      invitado:invitado,
      id_invitado :invitado.invitado_id,
    }
    const ruta = `${this.api}/lista_invitados/editar`;
    return this.http.put(ruta, body, headers);
  }  
  editarParametroRelacionador(parametro, token,correo) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      correo:correo ,
      parametro :parametro,
    }
    const ruta = `${this.api}/evento/editar_parametro_relacionador`;
    return this.http.post(ruta, body, headers);
  } 
  listarInvitadosRelacionadorService(id_relacionador,id_evento, token,correo) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      correo:correo ,
      id_relacionador:id_relacionador,
      id_evento :id_evento,
    }
    const ruta = `${this.api}/lista_invitados/listar_relacionador`;
    return this.http.post(ruta, body, headers);
  } 
  crearEvento(evento, imagen, token){
    const ruta = `${this.api}/api/usuario/registrar_evento_web`;
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const body = {
        fk_anfitrion:evento.usuario,
        evento:{
            nombre_evento: evento.nombreEvento,
            descripcion: evento.descripcion,
            tipo: evento.tipo,
            privacidad: evento.privacidad,
            nombre_lugar: evento.nombreLugar == null ? '' : evento.nombreLugar,
            direccion: evento.direccion == null ? '' : evento.direccion,
            link_maps: evento.linkMaps == null ? '' : evento.linkMaps,
            fecha_inicio: evento.fechaInicio,
            hora_inicio: evento.horaInicio,
            fecha_fin: evento.fechaFin,
            hora_fin: evento.horaFin,
            imagen: imagen,
            plan: evento.plan,
            planID: evento.planID

        }
    }
    let formData = new FormData();
    formData.append('body', JSON.stringify(body));
    return this.http.post(ruta, formData, headers)
  }

  obtenerPaises(){
    return this.listaPaises;
  }

}
