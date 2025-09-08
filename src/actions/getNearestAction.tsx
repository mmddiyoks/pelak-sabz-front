"use client";

import { Axios } from "@/@core/lib/axios/axios";
import { requestHandler } from "@/@core/lib/axios/requestHandler";



export default async function getNearestByTypeAction(typeId: string, coordinates?: number[]) {

    const data = await requestHandler(() => Axios.get(
        `/Plaque/SearchByType?subtype=${typeId}&x=${coordinates ? `${coordinates[0]}` : "51.68165161271452"}&y=${coordinates ? `${coordinates[1]}` : "32.68292618302155"}`
    ))()
    if (data.code == "success") {
        return data.data;
    }

    return null;
} 
