/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InvitadosService {
  private api = environment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

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
  obtenerCategorias(id_evento,token){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/categorias_invitados/listar/` + id_evento;
    return this.http.get(ruta, headers);
  }
}
