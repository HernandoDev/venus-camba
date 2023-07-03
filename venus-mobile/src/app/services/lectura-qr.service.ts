/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class LecturaQRService {
  private URL = environment.API_URL;
  constructor(private http: HttpClient, private tokenService: TokenService) { }

    verificarQR(id_evento: any, username: any,token) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const url = `${this.URL}/evento/leer_evento`;
    const body = { id_evento,username};
    return this.http.post(url, body, headers);
  }

  marcarEntradaInvitado(invitado_id,numero_invitados, token,username, observaciones,correo, telefono: number ){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const url = `${this.URL}/lista_invitados/insertar_acompanahnte`;
    const body = { invitado_id, numero_invitados ,username, correo , observaciones_guardia: observaciones, telefono }
    return this.http.post(url, body, headers);
  }
}
