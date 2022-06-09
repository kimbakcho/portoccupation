import type {PortEqpGetReqDto} from "@/Bis/Port/Dto/PortEqpGetReqDto";
import axios from "axios";
import type {PortSaveReqDto} from "@/Bis/Port/Dto/PortSaveReqDto";
import type {PortResDto} from "@/Bis/Port/Dto/PortResDto";

export class PortUseCase {

    async save(reqDto: PortSaveReqDto): Promise<PortResDto>{
        const { data } = await axios.post("/port",reqDto);
        return data;
    }

    async getEqpPort(reqDto: PortEqpGetReqDto): Promise<PortResDto[]>{

        const { data } = await axios.get("/port",{
            params: reqDto
        });
        return data;
    }

    async delete(idx: number): Promise<void> {
        await axios.delete("/port",{
            params:{
                idx: idx
            }
        })

    }
}