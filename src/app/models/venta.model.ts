import { Moment } from 'moment';
import { CilindroModel } from './cilindro.model';

export class VentaModel {
    // tslint:disable: variable-name
    created_at: string;
    rut_cliente: string;
    venta_id: number;
    codigo: string;
    fecha: string;
    finalizado: boolean;
    cliente_id: number;
    entrega: Moment;
    retorno: Moment;
    fecha_entrega: string;
    fecha_retorno: string;
    nombre_completo: string;
    activo: boolean;
    cilindro_id: number;
    cilindros: number[];
    cobros: CilindroModel[];
    monto: number;
    demora_id: number;
}
