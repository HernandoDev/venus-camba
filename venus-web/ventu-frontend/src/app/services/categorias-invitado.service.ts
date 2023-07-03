import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoriasInvitadoService {
  private api = environment.API_URL;

  constructor(private http: HttpClient) { }

  obtenerCategorias(id_evento,token){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    const ruta = `${this.api}/categorias_invitados/listar/` + id_evento;
    return this.http.get(ruta, headers);
  }
  eliminarCategoria(idCategoria,token){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      id_categoria:idCategoria
    }
    const ruta = `${this.api}/categorias_invitados/eliminar`;
    return this.http.post(ruta,body, headers);
  }

  insertarCategoria(valColor,nuevaCategoriaNombre,token,idEvento){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      valColor:valColor ,
      nombre:nuevaCategoriaNombre,
      token :token,
      fkevento:idEvento
    }
    const ruta = `${this.api}/categorias_invitados/insertar`;
    return this.http.post(ruta,body, headers);
  }

  editarCategoria(categoria,token){
    const headers = {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    };
    let body = {
      categoria:categoria ,
      token :token,
    }
    const ruta = `${this.api}/categorias_invitados/editar`;
    return this.http.put(ruta,body, headers);
  }  
}
