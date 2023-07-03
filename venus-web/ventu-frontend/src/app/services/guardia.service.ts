import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class GuardiaService {
    private api = environment.API_URL;

    constructor(private http: HttpClient) {}

    obtenerGuardias(id: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/usuario/obtener_guardias/` + id;
        return this.http.get(ruta, headers);
    }
    eliminarGuardia(id: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const body = {
            id_usuario: id,
        };
        const ruta = `${this.api}/usuario/eliminar`;
        return this.http.post(ruta, body, headers);
    }
    agregarGuardia(guardia: any, id: number,token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/api/usuario/registrar`;
        const body = {
            nombres: guardia.nombres,
            apellidos: guardia.apellidos,
            telefono: guardia.telefono,
            correo: guardia.usuario,
            contrasenha: guardia.contrasena,
            fk_rol: 2,
            username: guardia.usuario,
            boletin: 0,
            pais: "Bolivia",
            fk_anfitrion: id,
        };
        let formData = new FormData();
        formData.append("body", JSON.stringify(body));
        return this.http.post(ruta, formData, headers);
    }
    editarGuardia(id, guardia: any, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/usuario/editar`;
        const body = {
            nombres: guardia.nombres,
            apellidos: guardia.apellidos,
            telefono: guardia.telefono,
            username: guardia.usuario,
            contrasenha: guardia.contrasena,
            id_usuario: id,
        };
        let formData = new FormData();
        formData.append("body", JSON.stringify(body));
        return this.http.put(ruta, formData, headers);
    }
}
