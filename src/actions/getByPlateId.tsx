"use client"
import { Axios } from "@/@core/lib/axios/axios";
import { Logger } from "@/lib/logger";

const logger = Logger.get('getByPlateId');

export default async function getByPlateId(Code: string) {
    const req = await Axios.get(
        `/Plaque/getbyplates?plateid=${Code}`
    );
    if (req.status == 200) {
        console.log(req.data)
        return req.data;
    } else {
        logger.error("getAddressAction", req);
        return null;
    }
} 
