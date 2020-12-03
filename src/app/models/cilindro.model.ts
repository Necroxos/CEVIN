import { Moment } from 'moment';

export class CilindroModel {
    // tslint:disable: variable-name
    created_at: string;
    metros_cubicos: string;
    tipo_id: number;
    mantencion: Moment;
    fecha_mantencion: string;
    codigo_activo: string;
    desc_mantenimiento: string;
    mantencion_id: number;
    tipo_gas: string;
    cilindro_id: number;
    activo: boolean;
    propietario_id: number;
    propietario: string;
}
