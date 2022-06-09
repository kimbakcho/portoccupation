import {PortResDto} from "@/Bis/Port/Dto/PortResDto";
import {EqpEventTrxPpResDto} from "@/Bis/EqpEventTrxUseCase/Dto/EqpEventTrxPpResDto";
import {OccupationTimeData} from "@/components/OccupationAnalytics/Dto/occupationTimeData";

export interface OccupationAnalyticsPortResDto {
    port: PortResDto
    eqpEventTrxPpResDtoList: EqpEventTrxPpResDto[]
    occupationTimeList: OccupationTimeData[]
}