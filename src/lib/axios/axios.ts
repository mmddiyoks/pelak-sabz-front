import axios from "axios";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const GIS_URL = process.env.GIS_URL;

export const Axios = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const GisAxios = axios.create({
  baseURL: GIS_URL,
  withCredentials: true,
});
