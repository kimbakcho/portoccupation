import type {EqpSaveReqDto} from "@/Bis/Eqp/Dto/EqpSaveReqDto";
import axios from "axios";
import type {EqpResDto} from "@/Bis/Eqp/Dto/EqpResDto";

export class EqpUseCase {

    async save(reqDto: EqpSaveReqDto): Promise<EqpResDto> {
        const { data } = await axios.post("/eqp",reqDto)
        return data;
    }

    async getList(): Promise<EqpResDto[]>{
        const { data } = await axios.get("/eqp")
        return data;
    }

    async delete(eqpId: string) : Promise<void>{
        await axios.delete("/eqp",{
            params:{
                eqpId: eqpId
            }
        })
    }
}