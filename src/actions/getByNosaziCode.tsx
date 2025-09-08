"use client";

import { Axios } from "@/@core/lib/axios/axios";
import { requestHandler } from "@/@core/lib/axios/requestHandler";
import { Logger } from "@/lib/logger";

const logger = Logger.get('getByNosaziCode');

export default async function getByNosaziCode(Code: string) {
    const data = await requestHandler(() => Axios.get(
        `/Plaque/GetByPlatesByNosazi?nosacode=${Code}`
    ))();
    if (data.code == "success") {
        return data.data;
    } else {
        logger.error("getAddressAction", data.error);
        return null;
    }

} 
