/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  async obtenerTokenDesdeStorage(){
    const { value } = await Storage.get({ key: 'token' });
    return value;
  }
  async obtenerUsuarioDesdeStorage(){
    const { value } = await Storage.get({ key: 'usuario' });
    return value;
  }
  obtenerToken() {
    let token;
    this.obtenerTokenDesdeStorage().then((value) => {
      token = value;
      console.log(value);
    });
    console.log(token);
    const options = {
      headers: new HttpHeaders({Authorization: 'Bearer '+ token})
    };
    return options;
  }

}
