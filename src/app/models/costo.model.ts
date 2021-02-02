import { Moment } from 'moment';

export class CostoModel {
    // tslint:disable: variable-name
    created_at: string;
    updated_at: string;
    activo: boolean;
    costo_id: number;
    tipo_id: number;
    costo: number;
    fecha: string;
    fecha_moment: Moment;
    metros_cubicos: number;
}
