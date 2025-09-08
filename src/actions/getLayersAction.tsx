"use client";

import { requestHandler } from "@/@core/lib/axios/requestHandler";
import { Axios } from "@/@core/lib/axios/axios";

export default async function getLayerApi(code: string) {
  const data = await requestHandler(() => Axios.get(
    `/Plaque/GetSepecificPoint?code=${code}`
  ))()
  if (data.code == "success") {
    return data.data;
  }
  return null;
} 
