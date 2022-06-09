import {EqpEventTrxReqDto} from "@/Bis/EqpEventTrxUseCase/Dto/EqpEventTrxReqDto";
import {EqpEventTrxPpResDto} from "@/Bis/EqpEventTrxUseCase/Dto/EqpEventTrxPpResDto";
import axios from "axios";

export default class EqpEventTrxUseCase {
    async getEventList(reqDto: EqpEventTrxReqDto): Promise<EqpEventTrxPpResDto[]>{
        const { data } = await axios.post("/EqpEventTrx",reqDto)
        return data;
    }
}