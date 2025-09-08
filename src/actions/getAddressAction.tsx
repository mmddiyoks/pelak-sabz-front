"use client";

import { Axios } from "@/@core/lib/axios/axios";
import { requestHandler } from "@/@core/lib/axios/requestHandler";
import { Logger } from "@/lib/logger";

const logger = Logger.get('getAddressAction');

export default async function getAddress(coordinates: number[]) {
  const data = await requestHandler(() => Axios.post(
    `/Plaque?x=${coordinates[0]}&y=${coordinates[1]}`, {}
  ))();


  if (data.code == "success") {

    return data.data.address;
  } else {
    logger.error("getAddressAction", data.error);
    return null;
  }
} 
