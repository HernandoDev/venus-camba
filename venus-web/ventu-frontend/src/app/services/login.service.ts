import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private api = environment.API_URL;

  constructor(private http: HttpClient) { 

  }

  iniciarSesion(correo,contrasenha){
    const ruta = `${this.api}/api/usuario/login_web`;
    const body = {
      "correo": correo,
      "contrasenha": contrasenha
    }
    return this.http.post(ruta, body);
  }
}
