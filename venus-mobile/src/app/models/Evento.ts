/* eslint-disable @typescript-eslint/naming-convention */
import { Invitado } from './Invitado';

export interface Evento {
    cantidad_invitados?: number;
    categoria?:          string;
    descripcion?:        string;
    fecha_fin?:          Date;
    fecha_inicio?:       Date;
    hora_fin?:           string;
    hora_inicio?:        string;
    id?:                 number;
    imagen?:             string;
    invitados?:          Invitado[];
    nombre?:             string;
    tipo?:               number;
    habilitado?: boolean;
    imagen_fondo?: string;
    categoria_fondo?: string;
}
