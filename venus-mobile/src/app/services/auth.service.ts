import { Injectable } from '@angular/core';

import { HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  login(user: string, password: string) {
    const url = `${this.URL}/api/v1/usuario_movil/login`;
    const body = { user, password }
    return this.http.post(url, body);
  }

}
