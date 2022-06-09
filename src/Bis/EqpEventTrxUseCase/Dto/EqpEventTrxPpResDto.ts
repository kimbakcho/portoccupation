import {IdxEqpEventTrxPpPkResDto} from "@/Bis/EqpEventTrxUseCase/Dto/IdxEqpEventTrxPpPkResDto";

export interface EqpEventTrxPpResDto {
    idxEqpEventTrxPpPk: IdxEqpEventTrxPpPkResDto;

    eqpRawId: number;

    eqpEventRawId: number;

    eqpModuleId: string;

    eventDtts: string;

    eventState: string;

    operationId: string;

    lotId: string;

    lotTypeCd: string;

    cassetteSlot: number;

    substrateId: string;

    productId: string;

    recipeId: string;

    stepId: number;

    statusCd: string;

    rsd01: string;

    rsd02: string;

    rsd03: string;

    rsd04: string;

    rsd05: string;

    rsd06: string;

    rsd07: string;

    rsd08: string;

    rsd09: string;

    rsd10: string;

    rsd11: string;

    rsd12: string;

    rsd13: string;

    rsd14: string;

    rsd15: string;

    rsd16: string;

    rsd17: string;

    rsd18: string;

    rsd19: string;

    rsd20: string;

    createDtts: string;

    createBy: string;

    lastUpdateDtts: string;

    lastUpdateBy: string;

    mainModuleId: string;

    contextKey: string;

    rawId: number;
}