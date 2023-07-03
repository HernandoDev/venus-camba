import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpClientModule, HttpHeaders } from '@angular/common/http';
import { RespuestaLogin } from '../models/RespuestaLogin';
import { Usuario } from '../models/Usuario';
import { TokenService } from './token.service';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private api = environment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) { }

  iniciarSesion(usuario: Usuario) {
    const ruta = `${this.api}/api/usuario/login`;
    return this.http.post<RespuestaLogin>(ruta, usuario);
  }


  async cerrarSesion() {

    let token = await this.obtenerTokenDesdeStorage();
    let user_string = await this.obtenerUsuarioDesdeStorage();
    const user = JSON.parse(user_string);
    this.logOut(token,user.id).subscribe(async result => {
      this.eliminarStorage();
      this.router.navigate(['/login']);
    });
  }

  logOut(token,usuario_id){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const url = `${this.api}/api/usuario/logout`;
    const body = { usuario_id };
    return this.http.post(url, body, headers);
  }

  async obtenerTokenDesdeStorage(){
    const { value } = await Storage.get({ key: 'token' });
    return value;
  }
  async obtenerUsuarioDesdeStorage(){
    const { value } = await Storage.get({ key: 'usuario' });
    return value;
  }

  async eliminarStorage() {
    await Storage.clear();
  }
}

