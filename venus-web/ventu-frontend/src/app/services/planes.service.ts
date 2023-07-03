import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {
  private api = environment.API_URL;
  private apiBOT = environment.BOT_URL;
  constructor(private http: HttpClient,) { }

  listarPlanes(token: string) {
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/planes/listar`;
    return this.http.get(ruta, headers);
  }
}
