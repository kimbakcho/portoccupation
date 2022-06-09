import type {EqpResDto} from "@/Bis/Eqp/Dto/EqpResDto";

export interface PortResDto {
    idx: number;
    eqp: EqpResDto;
    portName: string;
    portNumber: number;
    fdcModuleName: string;
}