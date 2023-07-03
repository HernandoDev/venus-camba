import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class RelacionadorService {
    private api = environment.API_URL;

    constructor(private http: HttpClient) {}

    obtenerRelacionadores(id: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/usuario/obtener_relacionadores/` + id;
        return this.http.get(ruta, headers);
    }
    eliminarRelacionador(id: number, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const body = {
            id_usuario: id,
        };
        const ruta = `${this.api}/usuario/eliminar`;
        return this.http.post(ruta, body, headers);
    }
    agregarRelacionador(relacionador: any, id: number,token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/api/usuario/registrar`;
        const body = {
            nombres: relacionador.nombres,
            apellidos: relacionador.apellidos,
            telefono: relacionador.telefono,
            correo: relacionador.usuario,
            contrasenha: relacionador.contrasena,
            fk_rol: 3,
            username: relacionador.usuario,
            boletin: 0,
            pais: "Bolivia",
            fk_anfitrion: id,
        };
        let formData = new FormData();
        formData.append("body", JSON.stringify(body));
        return this.http.post(ruta, formData, headers);
    }
    editarRelacionador(id, relacionador: any, token: string) {
        const headers = {
            headers: new HttpHeaders({ Authorization: "Bearer " + token }),
        };
        const ruta = `${this.api}/usuario/editar`;
        const body = {
            nombres: relacionador.nombres,
            apellidos: relacionador.apellidos,
            telefono: relacionador.telefono,
            username: relacionador.usuario,
            contrasenha: relacionador.contrasena,
            id_usuario: id,
        };
        let formData = new FormData();
        formData.append("body", JSON.stringify(body));
        return this.http.put(ruta, formData, headers);
    }

}
