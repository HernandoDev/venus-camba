/* eslint-disable @typescript-eslint/naming-convention */
export interface RespuestaLogin {
    data?:    Data;
    message?: string;
    success?: boolean;
}

export interface Data {
    usuario?: Usuario;
}

export interface Usuario {
    activo?:             boolean;
    apellidos?:          string;
    contrasenha?:        string;
    correo?:             string;
    fecha_modificacion?: Date;
    fecha_registro?:     Date;
    fk_rol?:             number;
    id?:                 number;
    imagen?:             string;
    nombres?:            string;
    telefono?:           string;
    token?:              string;
    token_jwt?:          string;
}

