import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AnfitrionService {
    private api = environment.API_URL;

    constructor(private http: HttpClient) {}

    obtenerAnfitriones(id: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/usuario/obtener_anfitriones/` + id;
        return this.http.get(ruta, headers);
    }
    eliminarAnfitrion(id: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const body = {
            id_usuario: id,
        };
        const ruta = `${this.api}/usuario/eliminar`;
        return this.http.post(ruta, body, headers);
    }
    agregarAnfitrion(anfitrion: any, idPadre: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/api/usuario/registrar`;
        const body = {
            nombres: anfitrion.nombres,
            apellidos: anfitrion.apellidos,
            telefono: anfitrion.telefono,
            correo: anfitrion.email,
            contrasenha: anfitrion.contrasena,
            fk_rol: 1,
            username: anfitrion.email,
            boletin: 0,
            pais: "Bolivia",
            fk_anfitrion: idPadre,
        };
        let formData = new FormData();
        formData.append("body", JSON.stringify(body));
        return this.http.post(ruta, formData, headers);
    }
    editarAnfitrion(id, anfitrion: any, imagen, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/usuario/editar`;
        const body = {
            nombres: anfitrion.nombres,
            apellidos: anfitrion.apellidos,
            telefono: anfitrion.telefono,
            correo: anfitrion.email,
            contrasenha: anfitrion.contrasena,
            boletin: 0,
            pais: "Bolivia",
            id_usuario: id,
        };
        let formData = new FormData();
        formData.append("body", JSON.stringify(body));

        if(imagen != null && imagen != undefined){
            formData.append("imagen", imagen, imagen.name);
        }
        return this.http.put(ruta, formData, headers);
    }
}
