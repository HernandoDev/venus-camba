/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import moment from 'moment';
import { EditarEventoResponse } from '../models/EditarEventoResponse';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private api = environment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  public obtenerHora(timezone:any) {
    const link =`http://worldtimeapi.org/api/timezone/${timezone}`;
    return this.http.get(link);
  }
  obtenerEventoPorId(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/` + id;
    return this.http.get(ruta, headers);
  }

  obtenerEventos(token,usuario) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/listar`;
    const body = { usuario };
    return this.http.post(ruta, usuario, headers);
    // return this.http.get(ruta, headers);
  }

  editarEvento(evento, cambio, imagen, token) {
    const headers = {
      'enctype': 'multipart/form-data;',
      'Accept': 'plain/text',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token',
      'Authorization': 'Bearer ' + token
    };
    const formData = new FormData();
    const fechaInicio = moment(evento.fecha_inicio).format('DD/MM/YYYY');
    const fechaFin = moment(evento.fecha_fin).format('DD/MM/YYYY');
    const dataJson = {
      'id': evento.id,
      'nombre': evento.nombre,
      'fecha_inicio': fechaInicio,
      'hora_inicio': evento.hora_inicio,
      'fecha_fin': fechaFin,
      'hora_fin': evento.hora_fin,
    };
    formData.append('body', JSON.stringify(dataJson));
    if (cambio === true) {
      const imagenConvertida = this.convertirStringImagen(imagen);
      formData.append('imagen', imagenConvertida);
    }
    console.log(formData.getAll('imagen'));
    const ruta = `${this.api}/evento/editar`;
    return this.http.put<EditarEventoResponse>(ruta, formData, {headers});
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
  obtenerRelacionadoresEvento(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/obtener_relacionadores_evento/` + id;
    return this.http.get(ruta, headers);
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
  convertirStringImagen(stringImagen) {
    const realData = stringImagen.split(',')[1];
    const blob = this.b64toBlob(realData, 'image/jpeg');
    return blob;
  }
  obtenerGuardiasEvento(id: number, token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/evento/obtener_guardias_evento/` + id;
    return this.http.get(ruta, headers);
  }
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}
