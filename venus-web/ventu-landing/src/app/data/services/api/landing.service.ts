import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LandingService {
  url = environment.API_URL;
  constructor(private http: HttpClient) {}

  enviarCorreo(data: any) {
    let body = {
      nombre_completo: data.nombreCompleto,
      telefono: data.telefono,
      email: data.correo,
      consulta: data.consulta,
    };
    return this.http.post(this.url + 'landing/enviar_correo', body);
  }

  agregarCuentaEvento(cuenta: any, evento: any, logo: any, imagen: any) {
    let body: any = {
      anfitrion: {
        nombres: cuenta.nombres,
        apellidos: cuenta.apellidos,
        telefono: cuenta.telefono,
        correo: cuenta.correo,
        pais: cuenta.pais,
        logo: logo,
        boletin: cuenta.boletin,
      },
      evento: {
        nombre_evento: evento.nombreEvento,
        descripcion: evento.descripcion,
        tipo: evento.tipo,
        privacidad: evento.privacidad,
        nombre_lugar: evento.nombreLugar,
        direccion: evento.direccion,
        link_maps: evento.linkMaps,
        fecha_inicio: evento.fechaInicio,
        hora_inicio: evento.horaInicio,
        fecha_fin: evento.fechaFin,
        hora_fin: evento.horaFin,
        imagen: imagen,
        plan: evento.plan,
        pais: evento.pais,
      },
    };
    // add body to form data
    let formData = new FormData();
    formData.append('body', JSON.stringify(body));
    console.log(JSON.stringify(body));
    return this.http.post(this.url + 'api/usuario/registrar_anfitrion_evento', formData);
  }
}
