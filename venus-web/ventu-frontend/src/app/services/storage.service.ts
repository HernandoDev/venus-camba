import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  obtenerToken(): string {
    localStorage.getItem('token');
    return localStorage.getItem('token');
  }
  obtenerUsuario(): any{
    return JSON.parse(localStorage.getItem('usuario'));
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
  setUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  setEvento(evento: any): void {
    localStorage.setItem('evento', JSON.stringify(evento));
  }

  setImagenEvento(imagen: any): void {
    localStorage.setItem('urlImagen', imagen);
  }

  obtenerImagenEvento(): any{
    return localStorage.getItem('urlImagen');
  }

  obtenerEvento(): any{
    return JSON.parse(localStorage.getItem('evento'));
  }

  borrarEvento(){
    localStorage.removeItem('evento');
  }
  borrarImagenEvento(){
    localStorage.removeItem('urlImagen');
  }

  borrarStorage(){
    localStorage.clear();
  }
}
